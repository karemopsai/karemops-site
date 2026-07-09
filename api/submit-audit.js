// Vercel Serverless Function — Karemops AI Payroll Audit
// - Logs every submission to Supabase (audits table)
// - Sends the report to the visitor via Resend
// - Notifies karem@karemopsai.com via Resend (from audits@ to avoid self-send spam filter)
//
// Env vars required in Vercel project settings:
//   RESEND_API_KEY
//   SUPABASE_URL
//   SUPABASE_SERVICE_KEY   (service_role key — bypasses RLS)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      firstName, email, htmlReport, textSummary, bookCall,
      industry, revenueBand, teamSize,
      hourlyBand, hourlyMidpoint,
      functionsData, totals
    } = body;

    if (!firstName || !email || !htmlReport) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const cleanName = String(firstName).trim().slice(0, 60);
    const cleanEmail = String(email).trim().toLowerCase();

    // ------- 1. Log to Supabase (before emails — so we never lose a submission) -------
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const t = totals || {};
        const row = {
          first_name: cleanName,
          email: cleanEmail,
          book_call: !!bookCall,
          industry: industry || null,
          revenue_band: revenueBand || null,
          team_size: teamSize || null,
          hourly_band: hourlyBand || null,
          hourly_midpoint: numOrNull(hourlyMidpoint),
          functions_data: functionsData || null,
          total_manual_tasks: numOrNull(t.totalManualTasks),
          total_hours_per_week: numOrNull(t.totalHours),
          total_annual_payroll: numOrNull(t.totalPayroll),
          total_automatable: numOrNull(t.totalAutomatable),
          range_low: numOrNull(t.rangeLow),
          range_high: numOrNull(t.rangeHigh),
          hours_saved_weekly: numOrNull(t.hoursSavedWeekly),
          fte_equivalent: numOrNull(t.fte),
          payback_months: numOrNull(t.paybackMonths),
          user_agent: (req.headers['user-agent'] || '').slice(0, 500),
          referer: (req.headers['referer'] || req.headers['referrer'] || '').slice(0, 500)
        };
        const sbRes = await fetch(`${supabaseUrl}/rest/v1/audits`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(row)
        });
        if (!sbRes.ok) {
          const errText = await sbRes.text();
          console.error('Supabase insert failed:', sbRes.status, errText);
        }
      } catch (err) {
        console.error('Supabase insert exception:', err);
      }
    } else {
      console.warn('Supabase env vars missing — skipping log');
    }

    // ------- 2. Send report to user -------
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Karem <karem@karemopsai.com>',
        to: [cleanEmail],
        reply_to: 'karem@karemopsai.com',
        subject: `${cleanName}, your AI payroll audit is inside`,
        html: htmlReport
      })
    });

    if (!userRes.ok) {
      const errText = await userRes.text();
      console.error('Resend user email failed:', errText);
      return res.status(502).json({ error: 'Failed to send report' });
    }

    // ------- 3. Notify Karem (fire-and-forget) -------
    const notifyHtml = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2>New audit submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a></p>
        <p><strong>Wants call:</strong> ${bookCall ? 'YES — book them fast' : 'no'}</p>
        <hr />
        ${textSummary ? `<pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:12px;overflow-x:auto;">${escapeHtml(textSummary)}</pre>` : ''}
        <hr />
        <p style="font-size:12px;color:#666;">Full record saved to Supabase · audits table. Full report was sent to ${escapeHtml(cleanEmail)}.</p>
      </div>
    `;

    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Karemops Audits <audits@karemopsai.com>',
        to: ['karem@karemopsai.com'],
        reply_to: cleanEmail,
        subject: `NEW AUDIT · ${cleanName} · ${cleanEmail}${bookCall ? ' · WANTS CALL' : ''}`,
        html: notifyHtml
      })
    }).catch(err => console.error('Notify email failed:', err));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('submit-audit handler error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

function numOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
