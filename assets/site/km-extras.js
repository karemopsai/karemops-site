/* Karemops.ai site extras: loads the free Skool blocks; consult bar and HQ office waitlist stay off until approved.
 * One file, loaded on the homepage and every guide page:
 *   <script src="/assets/site/km-extras.js" defer></script>
 * The Club (v3): ivory, navy, brass lines, Meta blue, Cormorant headlines.
 */
(function () {
  'use strict';

  /* ================= CONFIG: the only two things to change ================= */
  var CONFIG = {
    // Rami's real Calendly link for the $50 consultation.
    CALENDLY_URL: 'PASTE_CALENDLY_URL',
    // Whish Money number for manual payment (Karem gives it).
    WHISH_NUMBER: 'PASTE_WHISH_NUMBER',
    // The $50 consult bar waits on its own yes from Karem. Keep false until then.
    CONSULT_LIVE: false,
    // Rami's endpoint (api/waitlist.js): writes rows to the Sheet in Karem's Drive.
    WAITLIST_ENDPOINT: '/api/waitlist',
    // Flip to true once Karem approves the Sheet setup (the endpoint answers 503 until then).
    WAITLIST_LIVE: false,
    CONSULT_PRICE: '$50',
    // Pages that also get the HQ office video card (path contains one of these).
    HQ_PAGES: ['claude-ai-team-hq']
  };
  /* ======================================================================== */

  if (window.__kmExtras) return;
  window.__kmExtras = true;

  // Free Skool blocks (banner on top, Karem's card above the credits, sticky bar) on every guide page.
  if (/\/(guides|lead-magnets)\//.test(location.pathname)) {
    var sb = document.createElement('script'); sb.src = '/assets/site/skool-blocks.js'; sb.defer = true;
    document.head.appendChild(sb);
  }

  var isPlaceholder = function (v) { return !v || v.indexOf('PASTE_') === 0; };
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';
  // Safety: until Rami's real links are in, nothing shows on the live site.
  var showConsult = CONFIG.CONSULT_LIVE && (!isPlaceholder(CONFIG.CALENDLY_URL) || LOCAL);
  var showForms = CONFIG.WAITLIST_LIVE || LOCAL;
  var path = location.pathname.toLowerCase();
  var isHQ = CONFIG.HQ_PAGES.some(function (p) { return path.indexOf(p) !== -1; });

  function lang() {
    var h = document.documentElement;
    var l = h.getAttribute('data-lang') || h.getAttribute('lang') || 'en';
    return l.slice(0, 2) === 'ar' ? 'ar' : 'en';
  }
  function source() {
    try { var s = sessionStorage.getItem('karemops_source'); if (s) return s; } catch (e) {}
    try { var u = new URLSearchParams(location.search).get('utm_source'); if (u) return u.toLowerCase(); } catch (e) {}
    try { if (document.referrer) return new URL(document.referrer).hostname; } catch (e) {}
    return 'direct';
  }
  function savedEmail() {
    try { return localStorage.getItem('karemops_email') || sessionStorage.getItem('karemops_email') || ''; } catch (e) { return ''; }
  }
  // Both languages are always in the DOM; CSS shows the one matching html[data-lang].
  function T(en, ar) { return '<span class="kmx-en">' + en + '</span><span class="kmx-ar">' + ar + '</span>'; }

  /* ---------------- fonts (only if the page lacks them) ---------------- */
  if (!/Cormorant\+Garamond/.test(document.head.innerHTML)) {
    var f = document.createElement('link');
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(f);
  }

  /* ---------------- styles ---------------- */
  var css = [
    '.kmx,.kmx *{box-sizing:border-box}',
    '.kmx{--kb:#0866FF;--kbh:#1E7AFF;--kbn:#4D92FF;--kiv:#FBF7EF;--kcr:#F2EAD9;--knv:#0E1A33;--kink:#1A1714;--kmu:#4A4438;--ksu:#7A7262;--kbr:#B08D57;--kln:#E4DACA;--kok:#12805C;',
    "--kse:'Cormorant Garamond',Georgia,serif;--ksa:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;--kar:'IBM Plex Sans Arabic','Inter',sans-serif;font-family:var(--ksa);-webkit-font-smoothing:antialiased;text-align:left;letter-spacing:normal}",
    '.kmx .kmx-ar{display:none!important}',
    'html[data-lang="ar"] .kmx .kmx-en{display:none!important}html[data-lang="ar"] .kmx .kmx-ar{display:inline!important}',
    'html[data-lang="ar"] .kmx{font-family:var(--kar);direction:rtl;text-align:right}',

    /* consult bar */
    '.kmx-bar{position:relative;z-index:50;width:100%;background:var(--knv);color:var(--kiv);border-bottom:1px solid var(--kbr)}',
    '.kmx-bar .in{max-width:1100px;margin:0 auto;padding:9px 16px;display:flex;align-items:center;justify-content:center;gap:10px 16px;flex-wrap:wrap;font-size:13.5px;line-height:1.35}',
    '.kmx-bar .lb{display:inline-flex;align-items:center;gap:10px}',
    '.kmx-bar .seal{width:6px;height:6px;border:1px solid var(--kbr);transform:rotate(45deg);flex:none}',
    '.kmx-bar b{font-weight:700;color:#fff}',
    '.kmx-bar .pr{font-family:var(--kse);font-weight:600;font-size:19px;line-height:1;color:#fff;letter-spacing:.01em;font-variant-numeric:lining-nums tabular-nums}',
    'html[data-lang="ar"] .kmx-bar .pr{font-family:var(--kar);font-size:15px;font-weight:700}',
    '.kmx-bar a.go{display:inline-flex;align-items:center;gap:6px;background:var(--kb);color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:7px 14px;border-radius:999px;white-space:nowrap}',
    '.kmx-bar a.go:hover{background:var(--kbh)}',
    '.kmx-bar .pay{flex-basis:100%;text-align:center;font-size:12px;color:#CFC6B4;line-height:1.4}',
    '.kmx-bar .pay bdi{color:#fff;font-weight:600;direction:ltr;unicode-bidi:isolate}',
    '.kmx-bar a.go:focus-visible{outline:2px solid var(--kiv);outline-offset:2px}',

    /* waitlist cards, shared */
    '.kmx-wrap{max-width:760px;margin:48px auto;padding:0 16px}',
    '.kmx-card{position:relative;background:var(--kiv);border:1.5px solid var(--kbr);padding:30px 28px 26px;color:var(--kink)}',
    '.kmx-card::after{content:"";position:absolute;inset:6px;border:1px solid var(--kln);pointer-events:none}',
    '.kmx-card>*{position:relative;z-index:1}',
    '.kmx-eb{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--kb);margin:0 0 10px}',
    'html[data-lang="ar"] .kmx-eb{letter-spacing:0;font-size:12.5px}',
    '.kmx-h{font-variant-numeric:lining-nums;font-family:var(--kse);font-weight:600;font-size:34px;line-height:1.06;letter-spacing:-.01em;color:var(--knv);margin:0 0 10px}',
    '.kmx-h em{font-style:italic;color:var(--kb)}',
    'html[data-lang="ar"] .kmx-h{font-family:var(--kar);font-weight:700;font-size:25px;line-height:1.4;letter-spacing:0}',
    'html[data-lang="ar"] .kmx-h em{font-style:normal}',
    '.kmx-p{font-size:15.5px;line-height:1.6;color:var(--kmu);margin:0 0 18px;max-width:58ch}',
    'html[data-lang="ar"] .kmx-p{line-height:1.85}',
    '.kmx-f{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.kmx-f .full{grid-column:1/-1}',
    '.kmx-f label{display:block;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--knv);margin:0 0 5px}',
    'html[data-lang="ar"] .kmx-f label{letter-spacing:0;font-size:12.5px}',
    '.kmx-f input{width:100%;font:inherit;font-size:16px;color:var(--kink);background:#fff;border:1px solid var(--kln);border-bottom:1.5px solid var(--kbr);border-radius:0;padding:11px 12px;outline:none;-webkit-appearance:none}',
    '.kmx-f input:focus{border-color:var(--kb)}',
    '.kmx-f input[type=tel],.kmx-f input[type=email]{direction:ltr;text-align:left}',
    '.kmx-or{font-size:12.5px;color:var(--ksu);margin:2px 0 0}',
    '.kmx-btn{font:inherit;font-weight:700;font-size:15px;color:#fff;background:var(--kb);border:0;border-radius:999px;padding:13px 22px;cursor:pointer;justify-self:start}',
    'html[data-lang="ar"] .kmx-btn{justify-self:end}',
    '.kmx-btn:hover{background:var(--kbh)}.kmx-btn:disabled{opacity:.6;cursor:default}',
    'a.kmx-btn{display:inline-flex;align-items:center;gap:8px;text-decoration:none}',
    'a.kmx-btn:focus-visible{outline:2px solid var(--knv);outline-offset:3px}',
    '.kmx-msg{font-size:13.5px;min-height:1.2em;margin:0}',
    '.kmx-msg.err{color:#a3172b}',
    '.kmx-done{display:flex;gap:12px;align-items:flex-start;font-size:15.5px;line-height:1.55;color:var(--kink)}',
    '.kmx-done .tk{flex:none;width:26px;height:26px;border-radius:50%;background:var(--kok);color:#fff;display:grid;place-items:center;font-weight:700;font-size:14px}',
    '.kmx-done b{display:block;color:var(--knv)}',
    '.kmx-stripe{position:absolute;left:0;right:0;bottom:0;height:6px;background:repeating-linear-gradient(135deg,#0E1A33 0 11px,#0866FF 11px 17px,#0E1A33 17px 28px,#FBF7EF 28px 30px);z-index:2}',
    '.kmx .kmx-f .kmx-hp{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;border:0!important;opacity:0;clip-path:inset(50%);overflow:hidden;pointer-events:none}',

    /* HQ office card: the panelled club room */
    '.kmx-hq{background:var(--knv);border:1.5px solid var(--kbr);color:var(--kiv);padding:30px 28px 26px;overflow:hidden}',
    '.kmx-hq::before{content:"";position:absolute;inset:0;background:radial-gradient(60% 80% at 85% 0%,rgba(176,141,87,.22),transparent 70%),repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 1px,transparent 1px 64px);pointer-events:none}',
    '.kmx-hq::after{border-color:rgba(176,141,87,.45)}',
    '.kmx-hq .kmx-eb{color:var(--kbn)}',
    '.kmx-hq .kmx-h{color:#fff}.kmx-hq .kmx-h em{color:var(--kbn)}',
    '.kmx-hq .kmx-p{color:#D9D2C3}',
    '.kmx-hq .kmx-f label{color:#E9E1D0}',
    '.kmx-hq .kmx-or{color:#B9B09E}',
    '.kmx-hq .kmx-msg.err{color:#ff9aa8}',
    '.kmx-hq .kmx-done{color:var(--kiv)}.kmx-hq .kmx-done b{color:#fff}',
    '.kmx-hq .kmx-f input{background:var(--kiv);border-color:rgba(176,141,87,.6)}',
    '.kmx-desks{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:4px 0 22px}',
    '.kmx-desk{border:1px solid rgba(176,141,87,.6);padding:9px 8px 8px;text-align:center;background:rgba(251,247,239,.03)}',
    '.kmx-desk .lamp{display:block;width:8px;height:8px;margin:0 auto 7px;border-radius:50%;background:#E8C98A;box-shadow:0 0 10px 2px rgba(232,201,138,.55)}',
    '.kmx-desk .lamp.off{background:#4A4438;box-shadow:none}',
    '.kmx-desk b{display:block;font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#E9E1D0}',
    'html[data-lang="ar"] .kmx-desk b{letter-spacing:0;font-size:12px}',
    '.kmx-plate{display:inline-block;font-family:var(--kse);font-weight:600;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--kbr);border-top:1px solid var(--kbr);border-bottom:1px solid var(--kbr);padding:3px 2px;margin:0 0 14px}',
    'html[data-lang="ar"] .kmx-plate{font-family:var(--kar);letter-spacing:0;font-size:13px}',

    '@media (max-width:560px){',
    '.kmx-bar .in{font-size:12.5px;gap:8px 10px;padding:8px 12px}',
    '.kmx-bar .pr{font-size:17px}',
    '.kmx-wrap{margin:36px auto}',
    '.kmx-card,.kmx-hq{padding:24px 18px 22px}',
    '.kmx-h{font-size:28px}',
    'html[data-lang="ar"] .kmx-h{font-size:22px}',
    '.kmx-f{grid-template-columns:1fr}',
    '.kmx-btn{width:100%;justify-self:stretch}',
    'a.kmx-btn{justify-content:center}',
    '.kmx-desks{grid-template-columns:repeat(2,1fr)}',
    '}'
  ].join('');

  /* ---------------- markup ---------------- */
  function consultBar() {
    var d = document.createElement('div');
    d.className = 'kmx kmx-bar';
    d.setAttribute('role', 'region');
    d.setAttribute('aria-label', 'Book a consultation');
    var href = isPlaceholder(CONFIG.CALENDLY_URL) ? '#calendly-link-coming' : CONFIG.CALENDLY_URL;
    var whish = isPlaceholder(CONFIG.WHISH_NUMBER) ? '[NUMBER]' : CONFIG.WHISH_NUMBER;
    d.innerHTML =
      '<div class="in">' +
        '<span class="lb"><i class="seal" aria-hidden="true"></i>' +
          T('<b>1-on-1 consultation</b> with Karem, <span class="pr">' + CONFIG.CONSULT_PRICE + '</span>',
            '<b>استشارة فردية</b> مع كريم، <span class="pr">50 دولارًا</span>') +
        '</span>' +
        '<a class="go" href="' + href + '" target="_blank" rel="noopener">' + T('Book a call ›', 'احجز مكالمة ‹') + '</a>' +
        '<span class="pay">' + T('Pay by PayPal, Apple Pay or Whish. To pay by Whish, message <bdi>' + whish + '</bdi>.',
                                 'الدفع عبر PayPal أو Apple Pay أو Whish. للدفع عبر Whish، راسل <bdi>' + whish + '</bdi>.') + '</span>' +
      '</div>';
    return d;
  }

  function fields(id) {
    return '<div class="full"><label for="' + id + '-n">' + T('Name', 'الاسم') + '</label>' +
      '<input id="' + id + '-n" name="name" type="text" autocomplete="name" maxlength="80" required></div>' +
      '<div><label for="' + id + '-e">' + T('Email', 'البريد الإلكتروني') + '</label>' +
      '<input id="' + id + '-e" name="email" type="email" inputmode="email" autocomplete="email" maxlength="120" placeholder="you@business.com"></div>' +
      '<div><label for="' + id + '-p">' + T('Phone (WhatsApp)', 'الهاتف (واتساب)') + '</label>' +
      '<input id="' + id + '-p" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="30" placeholder="+961 70 000 000"></div>' +
      '<p class="kmx-or full">' + T('Email or phone, one is enough.', 'يكفي البريد أو الهاتف.') + '</p>' +
      '<input class="kmx-hp" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div class="full"><button class="kmx-btn" type="submit">BTN</button></div>' +
      '<p class="kmx-msg full" role="status" aria-live="polite"></p>';
  }

  function hqCard() {
    var w = document.createElement('section');
    w.className = 'kmx kmx-wrap';
    w.id = 'hq-office-waitlist';
    var desk = function (en, ar, on) { return '<div class="kmx-desk"><i class="lamp' + (on ? '' : ' off') + '" aria-hidden="true"></i><b>' + T(en, ar) + '</b></div>'; };
    w.innerHTML =
      '<div class="kmx-card kmx-hq">' +
        '<span class="kmx-plate">' + T('The HQ office', 'مقرّ HQ') + '</span>' +
        '<p class="kmx-eb">' + T('Video waitlist', 'قائمة انتظار الفيديو') + '</p>' +
        '<h2 class="kmx-h">' + T('Want a full video walking you through building your own <em>HQ office?</em>',
                                 'تريد فيديو كاملًا يشرح لك كيف تبني <em>مقرّ HQ الخاص بك؟</em>') + '</h2>' +
        '<p class="kmx-p">' + T(
          'I&#8217;m filming the whole build, start to finish: the desks, the CEO session, the board and the daily routines. Join the list and you&#8217;ll get it first.',
          'أصوّر البناء كله من البداية للنهاية: المكاتب، وجلسة المدير التنفيذي، واللوحة، والمهام اليومية. انضم إلى القائمة وتحصل عليه أولًا.') + '</p>' +
        '<div class="kmx-desks" aria-hidden="true">' +
          desk('CEO', 'المدير', true) + desk('Content', 'المحتوى', true) + desk('Ads', 'الإعلانات', true) + desk('Yours', 'مكتبك', false) +
        '</div>' +
        '<form class="kmx-f" novalidate data-waitlist="hq-office">' +
          fields('kmx-h').replace('BTN', T('Save my spot', 'احجز مكاني')) +
        '</form>' +
      '</div>';
    return w;
  }

  /* ---------------- form logic ---------------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^\+?[0-9 ()\-.]{6,25}$/;
  function wire(form) {
    var startedAt = Date.now();
    var em = form.querySelector('[name=email]');
    if (em && !em.value) em.value = savedEmail();
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = form.querySelector('.kmx-msg');
      var btn = form.querySelector('.kmx-btn');
      var get = function (n) { var i = form.querySelector('[name=' + n + ']'); return i ? i.value.trim() : ''; };
      var name = get('name'), email = get('email'), phone = get('phone');
      var bad = function (en, ar) { msg.className = 'kmx-msg full err'; msg.innerHTML = T(en, ar); };
      msg.className = 'kmx-msg full'; msg.innerHTML = '';
      if (name.length < 2) return bad('Add your name.', 'أضف اسمك.');
      if (!email && !phone) return bad('Add your email or your phone number.', 'أضف بريدك الإلكتروني أو رقم هاتفك.');
      if (email && !EMAIL_RE.test(email)) return bad('That email doesn&#8217;t look right.', 'البريد الإلكتروني غير صحيح.');
      if (phone && (!PHONE_RE.test(phone) || phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 15)) return bad('That phone number doesn&#8217;t look right.', 'رقم الهاتف غير صحيح.');
      btn.disabled = true;
      var test = false;
      try { test = new URLSearchParams(location.search).has('test'); } catch (e) {}
      var body = {
        name: name, email: email, phone: phone,
        waitlist: form.getAttribute('data-waitlist'),
        source: location.pathname + ' · ' + lang() + ' · ' + source(),
        company_website: get('company_website'),
        started_at: startedAt,
        test: test
      };
      var done = function () {
        try { if (email) localStorage.setItem('karemops_email', email); } catch (e) {}
        form.outerHTML = '<div class="kmx-done" role="status"><span class="tk" aria-hidden="true">&#10003;</span><div>' +
          (body.waitlist === 'hq-office'
            ? T('<b>You&#8217;re on the list.</b>The video comes to you first when it&#8217;s ready.', '<b>أنت على القائمة.</b>يصلك الفيديو أولًا حين يجهز.')
            : T('<b>You&#8217;re on the list.</b>You&#8217;ll hear from me first.', '<b>أنت على القائمة.</b>ستسمع مني أولًا.')) +
          '</div></div>';
      };
      var fail = function () {
        btn.disabled = false;
        bad('Couldn&#8217;t save that. Try again in a minute.', 'لم يتم الحفظ. حاول مرة أخرى بعد دقيقة.');
      };
      fetch(CONFIG.WAITLIST_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.ok && j.ok) return done();
          // Local preview: the endpoint isn't running here or answers 503 until the Sheet is approved.
          if (LOCAL && (r.status === 404 || r.status === 405 || r.status === 501 || r.status === 503)) {
            if (window.console) console.info('[km-extras] preview, not saved (status ' + r.status + '):', body);
            return done();
          }
          if (r.status === 400 && j.error) { btn.disabled = false; msg.className = 'kmx-msg full err'; msg.textContent = j.error; return; }
          fail();
        });
      }).catch(function () { if (LOCAL) { done(); } else { fail(); } });
    });
  }

  /* ---------------- mount ---------------- */
  function mount() {
    if (!showConsult && !showForms) return;
    var st = document.createElement('style');
    st.id = 'kmx-css';
    st.textContent = css;
    document.head.appendChild(st);

    var body = document.body;
    if (showConsult) {
      var bar = consultBar();
      // Sits right under the 8px repp stripe when the page has one, else at the very top.
      var first = body.firstElementChild;
      if (first && /(^|\s)repp(\s|$)/.test(first.className || '')) body.insertBefore(bar, first.nextSibling);
      else body.insertBefore(bar, body.firstChild);
      // Full width even when the body has padding (the homepage does).
      var cs = getComputedStyle(body);
      var pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0;
      var pt = bar.previousElementSibling ? 0 : (parseFloat(cs.paddingTop) || 0);
      if (pl || pr || pt) {
        bar.style.marginLeft = -pl + 'px';
        bar.style.marginRight = -pr + 'px';
        bar.style.width = 'calc(100% + ' + (pl + pr) + 'px)';
        if (pt) { bar.style.marginTop = -pt + 'px'; bar.style.marginBottom = Math.min(pt, 32) + 'px'; }
      }
    }

    // Cards go before the page footer if there is one, else at the end of the page.
    var foot = document.querySelector('body > footer, footer.karemops-footer, body > .container > footer, footer');
    var place = function (el) {
      if (foot && foot.parentNode) foot.parentNode.insertBefore(el, foot);
      else body.appendChild(el);
    };
    // HQ office video waitlist (Sheet form) only on the HQ guide, and only once the Sheet is live.
    if (showForms && isHQ) place(hqCard());
    Array.prototype.forEach.call(document.querySelectorAll('.kmx-f'), wire);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
