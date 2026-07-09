// Vercel Serverless Function — Karemops AI Payroll Audit
// Sends the audit report to the user's email and notifies Karem.
// Requires RESEND_API_KEY env var in Vercel project settings.

export default async function handler(req, res) {
  // CORS (same-origin, but be explicit for safety)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { firstName, email, htmlReport, textSummary, bookCall } = body;

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

    const fromAddress = 'Karem <karem@karemopsai.com>';
    const cleanName = String(firstName).trim().slice(0, 60);
    const subject = `${cleanName}, your AI payroll audit is inside`;

    // 1. Send report to user
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        reply_to: 'karem@karemopsai.com',
        subject,
        html: htmlReport
      })
    });

    if (!userRes.ok) {
      const errText = await userRes.text();
      console.error('Resend user email failed:', errText);
      return res.status(502).json({ error: 'Failed to send report' });
    }

    // 2. Notify Karem (fire-and-forget; don't block user on this)
    const notifyHtml = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2>New audit submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Wants call:</strong> ${bookCall ? 'YES — book them fast' : 'no'}</p>
        <hr />
        ${textSummary ? `<pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:12px;overflow-x:auto;">${escapeHtml(textSummary)}</pre>` : ''}
        <hr />
        <p style="font-size:12px;color:#666;">Full report was sent to ${escapeHtml(email)} from karem@karemopsai.com.</p>
      </div>
    `;

    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Karemops Audit <karem@karemopsai.com>',
        to: ['karem@karemopsai.com'],
        reply_to: email,
        subject: `NEW AUDIT · ${cleanName} · ${email}${bookCall ? ' · WANTS CALL' : ''}`,
        html: notifyHtml
      })
    }).catch(err => console.error('Notify email failed:', err));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('submit-audit handler error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
