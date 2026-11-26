/* Karemops.ai guides: free Skool blocks (Karem's pick, 26 Nov 2026).
   Top: the Skool banner under the intro. Bottom: Karem's locked card (banner + Claude Code Setup tile)
   right above the guide's credits. A sticky bar while reading. Every button goes to karemopsai.com/skool.
   Loaded by /assets/site/km-extras.js, so every guide page and every newly generated guide gets it.
   Motion respects prefers-reduced-motion (final state, no movement). */
(function () {
  var LINK = 'https://www.karemopsai.com/skool';
  var IMG = '/assets/site/skool/';
  var q = new URLSearchParams(location.search);
  if (window.__kmSkool) return; window.__kmSkool = true;
  if (q.get('lang') === 'ar') { document.documentElement.setAttribute('data-lang', 'ar'); document.documentElement.dir = 'rtl'; }
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var path = location.pathname;
  var TYPE = path.indexOf('/lead-magnets/') > -1 ? 'guide' : path.indexOf('/guides/') > -1 ? 'pdp' : 'home';
  var AR = function () { return document.documentElement.getAttribute('data-lang') === 'ar'; };

  function T(en, ar) { return '<span class="sk-en">' + en + '</span><span class="sk-ar">' + ar + '</span>'; }
  function go(en, ar, from, cls) { return '<a class="sk-btn ' + (cls || '') + '" href="' + LINK + '" target="_blank" rel="noopener" data-sk="' + from + '"><span class="sh" aria-hidden="true"></span>' + T(en, ar) + '</a>'; }

  if (!document.querySelector('link[href*="Cormorant"]')) {
    var f = document.createElement('link'); f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;600;700&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap';
    document.head.appendChild(f);
  }

  var css = [
    ':root{--skb:#0866FF;--skbh:#1E7AFF;--skiv:#FBF7EF;--skcr:#F2EAD9;--sknv:#0E1A33;--skink:#1A1714;--skmu:#4A4438;--sksu:#7A7262;--skbr:#B08D57;--skln:#E4DACA;--skok:#12805C;--sks:"Cormorant Garamond",Georgia,serif;--ska:"IBM Plex Sans Arabic",system-ui,sans-serif;--skn:Inter,system-ui,sans-serif;--ease:cubic-bezier(.2,.8,.2,1)}',
    '.sk,.sk *{box-sizing:border-box}',
    '.sk h2{text-transform:none;letter-spacing:normal}',
    '.sk{font-family:var(--skn);color:var(--skink);text-align:left;-webkit-font-smoothing:antialiased}',
    'html[dir=rtl] .sk{text-align:right}',
    '.sk-ar{display:none!important}html[data-lang="ar"] .sk-ar{display:inline!important}html[data-lang="ar"] .sk-en{display:none!important}',
    'html[data-lang="ar"] .sk{font-family:var(--ska)}',
    '.sk img{display:block;max-width:none}',
    '.sk-eb{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--skb);margin:0 0 10px}',
    'html[data-lang="ar"] .sk-eb{letter-spacing:0;font-size:12.5px}',
    '.sk-h{font-family:var(--sks);font-weight:600;font-size:42px;line-height:1.02;letter-spacing:-.01em;color:var(--sknv);margin:0 0 12px;font-variant-numeric:lining-nums;text-transform:none!important}',
    '.sk-h em{font-style:italic;color:var(--skb)}',
    'html[data-lang="ar"] .sk-h{font-family:var(--ska);font-weight:700;font-size:27px;line-height:1.4;letter-spacing:0}html[data-lang="ar"] .sk-h em{font-style:normal}',
    '.sk-p{font-size:16px;line-height:1.6;color:var(--skmu);margin:0 0 16px;max-width:52ch}',
    /* button + shine */
    '.sk-btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:700;font-size:15.5px;color:#fff!important;background:var(--skb);text-decoration:none!important;border-radius:999px;padding:14px 26px;white-space:nowrap;line-height:1.1;box-shadow:0 6px 18px rgba(8,102,255,.28);transition:transform .2s var(--ease),background .2s}',
    '.sk-btn:hover{background:var(--skbh);transform:translateY(-1px)}',
    '.sk-btn:focus-visible{outline:2px solid var(--sknv);outline-offset:3px}',
    '.sk-btn .sh{position:absolute;top:0;bottom:0;left:-60%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-18deg);pointer-events:none}',
    '.sk.in .sk-btn .sh{animation:skShine 4.5s 1.4s ease-in-out infinite}',
    '@keyframes skShine{0%{left:-60%}22%{left:130%}100%{left:130%}}',
    '.sk-fine{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12.5px;color:var(--sksu);margin:12px 0 0}',
    '.sk-fine span.sk-t{display:inline-flex;align-items:center;gap:6px}',
    '.sk-fine span.sk-t::before{content:"";width:6px;height:6px;border:1px solid var(--skbr);transform:rotate(45deg)}',
    '.sk-card{position:relative;background:var(--skiv);border:1.5px solid var(--skbr);overflow:hidden}',
    '.sk-card::after{content:"";position:absolute;inset:6px;border:1px solid var(--skln);pointer-events:none;z-index:3}',
    '.sk-repp{position:absolute;left:0;right:0;bottom:0;height:7px;background:repeating-linear-gradient(135deg,#0E1A33 0 11px,#0866FF 11px 17px,#0E1A33 17px 28px,#FBF7EF 28px 30px);z-index:4}',
    /* generic reveal */
    '.sk .rv{opacity:0;transform:translateY(14px);transition:opacity .6s var(--ease),transform .6s var(--ease)}',
    '.sk.in .rv{opacity:1;transform:none}',
    '.sk.in .d1{transition-delay:.12s}.sk.in .d2{transition-delay:.24s}.sk.in .d3{transition-delay:.36s}.sk.in .d4{transition-delay:.48s}.sk.in .d5{transition-delay:.6s}',
    '.sk-caret{display:inline-block;width:2px;height:1em;background:var(--skb);vertical-align:-.12em;margin-inline-start:2px;animation:skBlink 1s steps(1) infinite}',
    '@keyframes skBlink{50%{opacity:0}}',
    /* checklist with tick draw */
    '.sk-list{list-style:none;margin:0 0 20px;padding:0;display:grid;gap:11px}',
    '.sk-list li{display:flex;gap:12px;align-items:flex-start;font-size:15px;line-height:1.5;color:var(--skink);padding:0!important}',
    '.sk-list li::before{display:none!important}',
    '.sk-list b{color:var(--sknv)}',
    '.sk-tk{flex:none;width:22px;height:22px;border-radius:50%;background:var(--skb);display:grid;place-items:center;margin-top:1px;transform:scale(.4);opacity:0;transition:transform .45s var(--ease),opacity .3s}',
    '.sk-tk svg{width:12px;height:12px}.sk-tk path{stroke:#fff;stroke-width:3;fill:none;stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .4s .2s ease}',
    '.sk.in .sk-tk{transform:none;opacity:1}.sk.in .sk-tk path{stroke-dashoffset:0}',
    '.sk.in li:nth-child(2) .sk-tk,.sk.in li:nth-child(2) .sk-tk path{transition-delay:.55s}',
    '.sk.in li:nth-child(3) .sk-tk,.sk.in li:nth-child(3) .sk-tk path{transition-delay:.9s}',

    '@keyframes skPing{0%{box-shadow:0 0 0 0 rgba(18,128,92,.5)}70%{box-shadow:0 0 0 10px rgba(18,128,92,0)}100%{box-shadow:0 0 0 0 rgba(18,128,92,0)}}',
    '@keyframes skBob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-8px) rotate(3deg)}}',


    /* ===== C: banner-led ===== */
    '.kc-ban{position:relative;display:grid;grid-template-columns:1.35fr 1fr;min-height:300px;background:var(--skiv)}',
    '.kc-ban .txt{position:relative;z-index:2;padding:30px 10px 34px 30px}',
    'html[dir=rtl] .kc-ban .txt{padding:30px 30px 34px 10px}',
    '.kc-brand{font-size:11px;font-weight:700;letter-spacing:.3em;color:var(--skbr);margin:0 0 10px}',
    '.kc-free{display:inline-flex;align-items:center;gap:10px;background:var(--skb);color:#fff;font-weight:800;font-size:13px;letter-spacing:.14em;padding:6px 14px;border-radius:999px;margin:0 0 12px}',
    'html[data-lang="ar"] .kc-free{letter-spacing:0}',
    '.kc-strip{display:flex;align-items:center;gap:12px;background:var(--skb);color:#fff;border-radius:8px;padding:10px 14px;margin:0 0 16px;box-shadow:0 8px 20px rgba(8,102,255,.25);max-width:440px;transform:translateX(-24px);opacity:0;transition:transform .7s .5s var(--ease),opacity .5s .5s}',
    'html[dir=rtl] .kc-strip{transform:translateX(24px)}',
    '.sk.in .kc-strip{transform:none;opacity:1}',
    '.kc-strip .ic{flex:none;width:40px;height:40px;background:#fff;border-radius:9px;display:grid;place-items:center;box-shadow:0 2px 6px rgba(0,0,0,.15)}',
    '.kc-strip .ic img{width:30px}',
    '.sk.in .kc-strip .ic{animation:skBob 3.5s 1.4s ease-in-out infinite}',
    '.kc-strip b{display:block;font-size:13px;letter-spacing:.12em;text-transform:uppercase}',
    'html[data-lang="ar"] .kc-strip b{letter-spacing:0;font-size:14px}',
    '.kc-strip small{display:block;font-size:13px;opacity:.92}',
    '.kc-photo{position:relative;overflow:hidden}',
    '.kc-photo img{position:absolute;bottom:0;right:2%;width:min(100%,360px);transform:translateY(36px);opacity:0;transition:transform 1s var(--ease),opacity .7s}',
    'html[dir=rtl] .kc-photo img{right:auto;left:2%}',
    '.sk.in .kc-photo img{transform:none;opacity:1}',
    '.kc-glow{position:absolute;right:-10%;bottom:-20%;width:90%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(8,102,255,.14),transparent 65%)}',
    'html[dir=rtl] .kc-glow{right:auto;left:-10%}',
    '.kc-top .sk-h{font-size:36px}',
    '.kc-course{margin:0 30px 34px;background:#fff;border-radius:12px;border:1px solid var(--skln);box-shadow:0 1px 2px rgba(14,26,51,.06),0 14px 32px rgba(14,26,51,.10);overflow:hidden;position:relative;z-index:2}',
    '.kc-course .bar{background:var(--sknv);color:#E9E1D0;font-size:12px;font-weight:600;padding:9px 14px;display:flex;align-items:center;gap:8px}',
    '.kc-course .bar i{width:8px;height:8px;border-radius:50%;background:#4A4438}',
    '.kc-course .bar .sp{flex:1}',
    '.kc-course .bar .fr{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sknv);background:var(--skiv);padding:2px 7px}',
    '.kc-cb{display:grid;grid-template-columns:150px 1fr;gap:18px;padding:16px;align-items:center}',
    '.kc-thumb{position:relative;height:120px;background:linear-gradient(180deg,var(--skcr),#E6DAC2);border:1px solid var(--skbr);overflow:hidden}',
    '.kc-thumb img{position:absolute;bottom:0;left:50%;height:112px;transform:translateX(-50%);image-rendering:pixelated}',
    '.kc-thumb .f2{opacity:0}',
    '.sk.in .kc-thumb .f2{animation:skType .5s steps(1) infinite}',
    '@keyframes skType{50%{opacity:1}}',
    '.kc-ti{font-family:var(--sks);font-weight:600;font-size:26px;line-height:1.05;color:var(--sknv);margin:0 0 4px}',
    'html[data-lang="ar"] .kc-ti{font-family:var(--ska);font-weight:700;font-size:19px;line-height:1.45}',
    '.kc-meta{font-size:13px;color:var(--skmu);margin:0 0 10px}',
    '.kc-prog{height:7px;background:var(--skcr);border-radius:4px;overflow:hidden;margin:0 0 5px}',
    '.kc-prog i{display:block;height:100%;width:0;background:var(--skok);transition:width 1s 1.2s var(--ease)}',
    '.sk.in .kc-prog i{width:20%}',
    '.kc-pl{font-size:12px;color:var(--sksu);margin:0 0 12px;font-variant-numeric:tabular-nums}',
    '.kc-pl .n{display:inline-block;min-width:.7em;color:var(--skok);font-weight:700}',
    '.kc-les{list-style:none;margin:0;padding:4px 16px 10px;border-top:1px solid var(--skln)}',
    '.kc-les li{display:flex;align-items:center;gap:12px;padding:10px 0!important;border-bottom:1px solid var(--skln);font-size:14.5px}',
    '.kc-les li::before{display:none!important}',
    '.kc-les li:last-child{border-bottom:0}',
    '.kc-les b{color:var(--sknv)}',
    '.kc-les .n{flex:none;width:26px;height:26px;border-radius:50%;border:1.5px solid var(--skb);color:var(--skb);display:grid;place-items:center;font-weight:700;font-size:12px;transition:all .4s 2.1s}',
    '.sk.in .kc-les li:first-child .n{background:var(--skok);border-color:var(--skok);color:#fff}',
    '.kc-les .r{margin-inline-start:auto;font-size:12px;color:var(--sksu);white-space:nowrap}',
    '.kc-sticky{position:fixed;left:50%;bottom:14px;transform:translate(-50%,160%);z-index:999;width:min(560px,calc(100% - 24px));background:var(--sknv);color:#fff;border:1.5px solid var(--skbr);border-radius:14px;box-shadow:0 14px 34px rgba(14,26,51,.35);display:flex;align-items:center;gap:12px;padding:10px 10px 10px 12px;transition:transform .45s var(--ease)}',
    '.kc-sticky.on{transform:translate(-50%,0)}',
    '.kc-sticky .ic{flex:none;width:38px;height:38px;background:#fff;border-radius:9px;display:grid;place-items:center}',
    '.kc-sticky .ic img{width:28px}',
    '.kc-sticky .tx{flex:1;min-width:0;font-size:13px;line-height:1.3;color:#E9E1D0}',
    '.kc-sticky .tx b{display:block;color:#fff;font-size:14.5px}',
    '.kc-sticky .sk-btn{padding:10px 16px;font-size:14px;box-shadow:none}',
    '.kc-sticky .x{flex:none;background:none;border:0;color:#B9B09E;font-size:20px;line-height:1;cursor:pointer;padding:4px 6px}',

    /* placement */
    '.sk-wrap{margin:30px 0}',
    '.sk-gband{max-width:8.5in;margin:0 auto 28px}',
    '.sk-home{margin:26px 0 30px}',
    '@media (max-width:640px){',
    '.sk-h{font-size:33px}',
    '.sk-card .sk-btn{width:100%}',
    '.kc-ban{display:block;min-height:0}',
    '.kc-ban .txt{padding:22px 18px 24px!important}',
    '.kc-ban .sk-h{max-width:64%;font-size:28px}',
    'html[data-lang="ar"] .kc-ban .sk-h{font-size:20px}',
    '.kc-photo{position:absolute;top:26px;right:6px;width:148px;height:210px;z-index:1}',
    'html[dir=rtl] .kc-photo{right:auto;left:6px}',
    '.kc-photo img{width:148px;right:0;-webkit-mask-image:linear-gradient(180deg,#000 72%,transparent 98%);mask-image:linear-gradient(180deg,#000 72%,transparent 98%)}',
    'html[dir=rtl] .kc-photo img{left:0}',
    '.kc-glow{right:-30%;bottom:-10%;width:150%}',
    '.kc-strip{position:relative;z-index:3;max-width:none}',
    '.kc-ban .sk-btn{width:100%}',
    '.kc-course{margin:0 14px 30px}',
    '.kc-cb{grid-template-columns:1fr;gap:12px}',
    '.kc-thumb{height:130px}',
    '.sk-gband{margin:0 0 10px;padding:0 10px}',
    '}',
    '@media (prefers-reduced-motion:reduce){.sk *,.sk{animation:none!important;transition:none!important}.sk .rv,.sk-tk,.kc-strip,.kc-photo img{opacity:1!important;transform:none!important}.kc-prog i{width:20%!important}.kc-sticky{transition:none!important}}',
    '@media print{.sk{display:none!important}}'
  ].join('');

  var tick = '<i class="sk-tk"><svg viewBox="0 0 12 12"><path d="M2 6.5l2.6 2.5L10 3.5"/></svg></i>';
  var fine = '<p class="sk-fine rv d4"><span class="sk-t">' + T('Free to join', 'الانضمام مجاني') + '</span><span class="sk-t">' + T('No card', 'بدون بطاقة') + '</span><span class="sk-t">' + T('Never opened Terminal? Fine', 'لم تفتح Terminal من قبل؟ لا مشكلة') + '</span></p>';

  /* ---------- C: banner-led ---------- */
  function banner(big, from) {
    return '<div class="kc-ban"><div class="txt">' +
      '<p class="kc-brand rv">KAREMOPS.AI</p>' +
      '<span class="kc-free rv d1">' + T('FREE', 'مجاني') + '</span>' +
      '<h2 class="sk-h rv d2">' + T('Set up Claude Code for your <em>business.</em>', 'خلّي Claude Code <em>يشتغل عنك.</em>') + '</h2>' +
      '<div class="kc-strip"><span class="ic"><img src="' + IMG + 'icon-skool.png" alt=""></span><span><b>' + T('Free on Skool', 'مجانًا على Skool') + '</b><small>' + T('5 short videos. No coding. No card.', '5 فيديوهات قصيرة. بدون برمجة. بدون بطاقة.') + '</small></span></div>' +
      go(big ? 'Join free on Skool ›' : 'Start free ›', big ? 'انضم مجانًا على Skool ›' : 'ابدأ مجانًا ›', from, 'rv d4') +
      '</div><div class="kc-photo"><i class="kc-glow"></i><img src="' + IMG + 'karem-arms.png" alt="Karem AlMoayyad"></div></div>';
  }
  function cTop() {
    var d = document.createElement('div'); d.className = 'sk sk-card kc-top sk-wrap';
    d.innerHTML = banner(false, 'c-top') + '<i class="sk-repp"></i>';
    return d;
  }
  function cBottom() {
    var d = document.createElement('section'); d.className = 'sk sk-card kc-bot sk-wrap';
    d.innerHTML = banner(true, 'c-bottom') +
      '<div class="kc-course rv d3"><div class="bar"><i></i><i></i><i></i><span class="sp">' + T('Classroom · Karemops on Skool', 'الصف · Karemops على Skool') + '</span><span class="fr">' + T('Free', 'مجانًا') + '</span></div>' +
      '<div class="kc-cb"><div class="kc-thumb"><img src="' + IMG + 'karem-pixel-typing-a.png" alt=""><img class="f2" src="' + IMG + 'karem-pixel-typing-b.png" alt=""></div>' +
      '<div><p class="kc-ti">' + T('Claude Code Setup', 'إعداد Claude Code') + '</p><p class="kc-meta">' + T('5 short videos · by video 5, Claude Code runs a real task for you', '5 فيديوهات قصيرة · مع الفيديو الخامس ينفّذ Claude Code مهمة حقيقية لك') + '</p>' +
      '<div class="kc-prog"><i></i></div><p class="kc-pl">' + T('<span class="n" data-count>0</span> of 5 done', '<span class="n" data-count>0</span> من 5') + '</p></div></div>' +
      '<ul class="kc-les">' +
        '<li><span class="n">1</span><span>' + T('<b>Start Here</b>, the path in order', '<b>ابدأ هنا</b>، الطريق بالترتيب') + '</span><span class="r">' + T('3 lessons', '3 دروس') + '</span></li>' +
        '<li><span class="n">2</span><span>' + T('<b>Install Claude Code</b>, connect your tools', '<b>ثبّت Claude Code</b> واربط أدواتك') + '</span><span class="r">' + T('Setup videos', 'فيديوهات الإعداد') + '</span></li>' +
        '<li><span class="n">3</span><span>' + T('<b>Run your first real task</b>', '<b>نفّذ أول مهمة حقيقية</b>') + '</span><span class="r">' + T('Video 5', 'الفيديو 5') + '</span></li>' +
        '<li><span class="n">4</span><span>' + T('<b>Ask in the community</b>, I answer every post', '<b>اسأل في المجتمع</b>، أرد على كل منشور') + '</span><span class="r">' + T('Anytime', 'أي وقت') + '</span></li>' +
      '</ul></div><i class="sk-repp"></i>';
    return d;
  }
  function cSticky() {
    var d = document.createElement('div'); d.className = 'sk kc-sticky'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Free course');
    d.innerHTML = '<span class="ic"><img src="' + IMG + 'icon-skool.png" alt=""></span><div class="tx">' + T('<b>Free Claude Code course</b>5 short videos · No card', '<b>كورس Claude Code مجاني</b>5 فيديوهات قصيرة · بدون بطاقة') + '</div>' +
      go('Start free ›', 'ابدأ مجانًا ›', 'c-sticky') + '<button class="x" type="button" aria-label="Close">×</button>';
    d.querySelector('.x').onclick = function () { d.remove(); };
    return d;
  }

  /* ---------- motion ---------- */
  function count(block) {
    var n = block.querySelectorAll('[data-count]');
    setTimeout(function () { n.forEach(function (x) { x.textContent = '1'; }); }, RM ? 0 : 2100);
  }
  function play(el) {
    if (el.__played) return; el.__played = true; el.classList.add('in');
    if (el.getAttribute('data-walk')) walk(el);
    count(el);
  }

  /* ---------- placement ---------- */
  function mount() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var body = document.body, t = cTop(), b = cBottom();
    if (TYPE === 'pdp') {
      // Landing page: banner under the intro, card under the last block before the site footer.
      var lede = document.querySelector('.lede') || document.querySelector('h1');
      if (!lede) return;
      lede.parentNode.insertBefore(t, lede.nextSibling);
      var work = document.getElementById('work'), foot = document.querySelector('body > footer');
      if (work) work.parentNode.insertBefore(b, work.nextSibling);
      else if (foot) foot.parentNode.insertBefore(b, foot); else body.appendChild(b);
    } else if (TYPE === 'guide') {
      var pages = document.querySelectorAll('section.page');
      if (!pages.length) return;
      var band = document.createElement('div'); band.className = 'sk-gband'; band.appendChild(t); pages[0].parentNode.insertBefore(band, pages[0]);
      var last = pages[pages.length - 1];
      // Card goes right above the credits: the Credit/Sources heading, else the "Built by" box, else after the last page.
      var anchor = [].slice.call(last.querySelectorAll('h3')).filter(function (h) { return /credit|sources|المصادر/i.test(h.textContent); })[0] || last.querySelector('.cta');
      if (anchor) {
        b.style.margin = '6px 0 26px'; anchor.parentNode.insertBefore(b, anchor);
        var fix = document.createElement('style'); fix.textContent = '@media screen{.sk-grow{height:auto!important;min-height:11in}}'; document.head.appendChild(fix);
        last.classList.add('sk-grow');
      } else {
        var bb = document.createElement('div'); bb.className = 'sk-gband'; bb.appendChild(b); last.parentNode.insertBefore(bb, last.nextSibling);
      }
    } else return;
    var blocks = [t, b];
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } }); }, { threshold: 0.25 });
      blocks.forEach(function (x) { io.observe(x); });
    } else blocks.forEach(play);

    {
      var s = cSticky(); body.appendChild(s);
      var check = function () {
        var tr = t.getBoundingClientRect(), br = b.getBoundingClientRect(), vh = innerHeight;
        s.classList.toggle('on', tr.bottom < 0 && !(br.top < vh && br.bottom > 0));
      };
      addEventListener('scroll', check, { passive: true }); addEventListener('resize', check); check();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
