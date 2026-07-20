#!/usr/bin/env python3
"""Generate per-guide landing pages from the first-skill.html template."""
import os, re

TEMPLATE_PATH = '/Users/karoom/Desktop/karemops-site/guides/first-skill.html'
OUT_DIR = '/Users/karoom/Desktop/karemops-site/guides'
BASE = 'https://www.karemopsai.com'

# ---- per-guide content ----
GUIDES = [
    {
        'slug': 'humanizer',
        'title': 'Make AI Writing Sound Human',
        'meta_desc': 'The free Claude skill that checks your text against 33 AI tells and rewrites it in your voice. Paste one GitHub link into Claude Code and it installs itself. No code.',
        'kicker': 'CLAUDE CODE · WRITING',
        'h1_pre': 'Make AI Writing Sound',
        'h1_accent': 'Human',
        'lede': "People smell AI writing in half a second, and the moment they do, they stop reading. This free skill checks your text against 33 documented AI tells, rewrites it in your voice, then double-checks its own work. You install it by pasting one link into Claude Code.",
        'callout': "Copy the GitHub link. Paste one prompt into Claude Code. Let it install the skill for you. Then paste any text and it comes back sounding like a person — no coding, no terminal commands to memorize.",
        'inside': [
            ('🕵️', 'The 33 tells that scream "a robot wrote this" — and why readers clock them instantly'),
            ('🔗', 'The GitHub link + the exact prompt to paste so Claude Code installs it for you'),
            ('✍️', 'How to run it on any text — captions, cold emails, DMs, posts'),
            ('🎙️', 'The voice-match trick: feed it a sample so it rewrites in <em>your</em> voice, not generic clean'),
        ],
        'dl_items': [
            ('install-prompt.md', 'the copy-paste prompt that makes Claude Code install the skill'),
            ('how-to-run.md', 'the trigger + how to humanize any text in one message'),
            ('voice-match.md', 'the sample-first prompt that copies your writing style'),
        ],
        'dl_folder': 'humanizer',
        'what_p1': "It's never one big thing that gives AI writing away. It's a hundred tiny tells stacked up — the em dashes, the 'it's not just X, it's Y,' the words no human says out loud like delve, tapestry, testament, seamless. Your reader clocks it in half a second even if they can't name why.",
        'what_p2': "The Humanizer is a free skill built on Wikipedia's documented list of AI writing signs. You give it text. It checks against 33 specific tells, rewrites it to sound human, and runs a second pass on its own output to catch anything it missed. Feed it a sample of your writing and it copies your voice instead of a generic clean one.",
        'what_bq': "This matters most for cold email. Inboxes and readers are now allergic to AI-written copy. One whiff and you're spam. Sounding human isn't a nice-to-have — it's the difference between a reply and silence.",
        'what_p3': 'This is the install and how to run it.',
        'lead_magnet': 'lead-magnets/humanizer-guide.html',
    },
    {
        'slug': 'infinite-content',
        'title': 'Infinite Content Unlocked',
        'meta_desc': 'The exact Claude Code prompt that turns one idea into 100 short-form scripts — 5 angles, 4 hooks each, in your voice, for IG, TikTok, and YouTube Shorts.',
        'kicker': 'CLAUDE CODE · CONTENT',
        'h1_pre': 'Infinite Content',
        'h1_accent': 'Unlocked',
        'lede': "One prompt. One idea in. 100 short-form scripts out — every angle, every hook, in your voice — in under two minutes. This is the exact prompt, plus how to feed it your voice so it doesn't sound like a robot.",
        'callout': "The prompt is only as good as what you feed it. Give it your real hooks and a real voice sample and it writes like you. Skip that and it sounds like every other AI script on the feed.",
        'inside': [
            ('🧠', 'Why one idea is enough — the 5×4×5 = 100 breakdown'),
            ('⚡', 'The master prompt, copy-paste ready — just fill in 3 brackets'),
            ('🎯', 'The 3 inputs that make every script sound like you, not a bot'),
            ('🔁', 'The 3 follow-up prompts that cut 100 down to a filmable 10 + push to Airtable'),
        ],
        'dl_items': [
            ('master-prompt.md', 'the full 1-idea-to-100-scripts prompt, copy-paste ready'),
            ('inputs-checklist.md', 'the 3 inputs to load before you run it — hooks, voice, idea'),
            ('refine-prompts.md', 'the 3 follow-ups: rank, sharpen, and export to your pipeline'),
        ],
        'dl_folder': 'infinite-content',
        'what_p1': "Most creators film one idea, post it once, and pray. That's the whole problem. One idea can carry a month of content — you just never had the machine to unpack it.",
        'what_p2': "Claude Code is that machine. Hand it a single idea plus your voice, and it writes 5 angles, 4 hooks per angle, and 5 full scripts per hook. That's 100 shorts from one thought — every one built to film, not just read.",
        'what_bq': "The creators who win aren't the most creative. They're the ones who never run out of at-bats. This is how you get infinite at-bats from a single idea.",
        'what_p3': 'This is the exact prompt, and how to run it.',
        'lead_magnet': 'lead-magnets/infinite-content-guide.html',
    },
    {
        'slug': 'claude-skill-builder',
        'title': 'Build Your First Claude Skill',
        'meta_desc': 'The no-code way to build a Claude skill. One copy-paste prompt interviews you and writes it. Teach Claude a task once, use it forever.',
        'kicker': 'CLAUDE APP · SKILLS',
        'h1_pre': 'Build Your First Claude',
        'h1_accent': 'Skill',
        'lede': "Teach Claude a task once and it does it the same way forever. No code, no terminal. One copy-paste prompt interviews you and builds the whole skill. You'll ship your first one in about 10 minutes.",
        'callout': "You don't write the skill yourself. The Skill Builder prompt asks you a few plain-English questions about a task you already do, then writes it for you. Your job is just to answer.",
        'inside': [
            ('🧠', 'What a skill actually is — plain English, no dev-speak'),
            ('⚡', 'The copy-paste Skill Builder prompt that interviews you and writes it'),
            ('🎯', 'Exactly where to save it in the Claude app so it runs forever'),
            ('🧩', '4 starter skills you can steal — post writer, DM responder, and more'),
        ],
        'dl_items': [
            ('skill-builder-prompt.md', 'the full Skill Builder prompt, copy-paste ready'),
            ('skill-format.md', 'the finished skill format Claude fills in for you'),
            ('starter-skills.md', 'the 4 stealable starter skills'),
        ],
        'dl_folder': 'claude-skill-builder',
        'what_p1': "Most people re-explain the same task to Claude every single day. Different wording, same job. That's a tax on your time and the quality drifts every time.",
        'what_p2': "A skill fixes that. You teach Claude once — the steps, your voice, the rules — and it becomes a reusable command. This guide hands you a prompt that builds the skill for you, so you never touch code.",
        'what_bq': "The people who look 10x faster with AI aren't prompting harder. They stopped re-explaining themselves and saved the instructions once. That's the entire gap.",
        'what_p3': 'This guide closes it in 10 minutes.',
        'lead_magnet': 'lead-magnets/build-your-first-skill-guide.html',
    },
    {
        'slug': 'truth-prompt',
        'title': 'The Truth Prompt',
        'meta_desc': 'One prompt that stops Claude and ChatGPT from confidently making things up. Install once, use forever.',
        'kicker': 'CLAUDE · CHATGPT · PROMPT',
        'h1_pre': 'The Truth',
        'h1_accent': 'Prompt',
        'lede': "One copy-paste system prompt that stops Claude and ChatGPT from confidently making things up. It forces the model to separate fact from guess, score its own confidence, and tell you when it doesn't know.",
        'callout': "Install once. Every future chat is quieter, sharper, and safer to act on. Works in Claude, Claude Code, ChatGPT, and any API you're building on.",
        'inside': [
            ('🧠', 'The full Truth Prompt — copy-paste, one block, ready to install'),
            ('⚡', 'Where it goes in Claude, Claude Code, ChatGPT, and the API'),
            ('🎯', '8 in-the-moment follow-ups that force it to stay honest'),
            ('📋', 'A one-page cheat sheet you can screenshot'),
        ],
        'dl_items': [
            ('truth-prompt.md', 'the full Truth Prompt, one block, drop in anywhere'),
            ('short-prompts.md', 'the compressed + one-liner + audit versions'),
            ('follow-ups.md', 'the 8 in-the-moment follow-ups to pressure-test any answer'),
        ],
        'dl_folder': 'truth-prompt',
        'what_p1': "Every hallucinated stat, fake citation, and made-up function name has the same root cause: the model has no internal alarm that goes off when it crosses from recall into invention. Both feel the same to it.",
        'what_p2': "The Truth Prompt is the fix. It doesn't make the model smarter — it changes the process before it answers and forces it to show you its work after. Every response comes back with a confidence score and a caveats section that tells you exactly what to verify.",
        'what_bq': "The single biggest gain from this prompt is not fewer errors. It's that the errors now announce themselves. A wrong answer that says 'confidence 0.6, I'm extrapolating here' is a wrong answer you will not act on.",
        'what_p3': 'Install it once. Every future chat gets safer to trust.',
        'lead_magnet': 'lead-magnets/truth-prompt-guide.html',
    },
    {
        'slug': 'fable-5',
        'title': 'The Fable 5 Playbook',
        'meta_desc': 'How to prompt the most powerful model you can actually use — plus 10 copy-paste jobs to run before it flips to pay-as-you-go.',
        'kicker': 'CLAUDE · FABLE 5',
        'h1_pre': 'The Fable 5',
        'h1_accent': 'Playbook',
        'lede': "How to prompt the most powerful Claude model you can actually use right now — plus 10 copy-paste jobs to run before Fable flips to pay-as-you-go.",
        'callout': 'Fable is Claude at max power. This is the playbook I use to squeeze real work out of it — before the free window closes.',
        'inside': [
            ('🧠', 'The prompting patterns Fable rewards (and the ones it wastes)'),
            ('⚡', '10 copy-paste jobs to run <em>today</em> — audits, rewrites, teardowns'),
            ('📈', 'The system prompt I paste into every Fable session'),
            ('⏳', "Exactly when the free tier ends and what to do before it does"),
        ],
        'dl_items': [
            ('fable-system-prompt.md', 'the system prompt I paste on every Fable session'),
            ('fable-10-jobs.md', 'the 10 copy-paste jobs — pick one, ship one today'),
            ('fable-quickstart.md', 'the 3-minute setup — model picker, defaults, guardrails'),
        ],
        'dl_folder': 'fable',
        'what_p1': 'Fable is the most powerful Claude model in the wild — and for now, you can use it without paying per token. That will not last.',
        'what_p2': "Most people are still writing prompts like it's ChatGPT. That leaves 80% of the model on the table. This guide is the fix — the exact patterns Fable rewards, and the copy-paste jobs I've stress-tested this week.",
        'what_bq': "The gap between people using Fable and people <em>knowing how to prompt Fable</em> is the same gap that made the first ChatGPT power users rich. This guide is that head start.",
        'what_p3': 'Use it while the window is open.',
        'lead_magnet': 'lead-magnets/fable-5-playbook-guide.html',
    },
    {
        'slug': 'infinite-leads',
        'title': 'Claude Code = Infinite Leads',
        'meta_desc': 'The setup that turns Claude Code into a lead-gen machine — DM keywords → auto-send guides → warm every reply.',
        'kicker': 'CLAUDE CODE · LEAD GEN',
        'h1_pre': 'Claude Code =',
        'h1_accent': 'Infinite Leads',
        'lede': "The exact setup that turns every post into a lead machine. DM keyword → auto-send guide → warm every reply. Runs while you sleep.",
        'callout': "One post fires the funnel. The DM keyword lands the guide. Claude Code warms the reply. This guide gives you the whole loop.",
        'inside': [
            ('📣', 'The DM keyword pattern that turns a comment into a warm lead'),
            ('🤖', 'The Claude Code agent that sends the guide + logs the email'),
            ('🔥', 'The follow-up sequence that warms every reply (without sounding like a bot)'),
            ('📊', 'The spreadsheet I use to track every DM → book → close'),
        ],
        'dl_items': [
            ('dm-keyword-flow.md', 'the keyword → guide → CRM flow diagrammed step by step'),
            ('lead-gen-agent.md', 'the Claude Code agent config you drop in'),
            ('warm-reply-sequence.md', 'the reply cadence — copy, timing, escalation'),
        ],
        'dl_folder': 'infinite-leads',
        'what_p1': "Every post you make should end in one thing: a warm lead in your inbox. This guide is the exact wiring — from comment → DM → guide sent → email captured → follow-up fired.",
        'what_p2': "I built this loop with Claude Code. Once it's running, the entire lead-gen operation is one command in a terminal — and it doesn't stop when you sleep.",
        'what_bq': "If you post content but your DMs are empty and your funnel is flat — this is the missing wiring. Not more posts. Better plumbing.",
        'what_p3': 'This is that plumbing.',
        'lead_magnet': 'lead-magnets/infinite-leads-guide.html',
    },
    {
        'slug': '5-platforms',
        'title': 'Post to 5 Platforms a Day',
        'meta_desc': 'The Claude Code repurposing stack: one video → IG, TikTok, LinkedIn, YouTube, X — every day.',
        'kicker': 'CLAUDE CODE · CONTENT',
        'h1_pre': 'Post to 5',
        'h1_accent': 'Platforms',
        'lede': "The Claude Code repurposing stack that ships one video to IG, TikTok, LinkedIn, YouTube Shorts, and X every single day — without a content manager.",
        'callout': "One video in, five platforms out. This is the Claude Code stack that runs the repurpose while you're already onto the next shoot.",
        'inside': [
            ('🎥', 'The one-video-in workflow: raw file → 5 platform-native outputs'),
            ('✂️', 'The Claude Code skills that caption, hook, and repost'),
            ('📅', 'The daily post schedule — what fires where, at what time'),
            ('📈', 'How I track which platform is actually working, weekly'),
        ],
        'dl_items': [
            ('repurpose-flow.md', 'the full pipeline — raw video → 5 finished posts'),
            ('platform-templates.md', 'per-platform caption + hashtag + CTA templates'),
            ('post-scheduler.md', 'the daily/weekly schedule I run against'),
        ],
        'dl_folder': '5-platforms',
        'what_p1': 'Cross-posting the same video to five platforms sounds easy. Doing it every day, without burning an hour reformatting captions and thumbnails, is the actual bottleneck.',
        'what_p2': "This guide is the fix. One raw video goes into the pipeline. Five platform-native posts come out. Claude Code handles the captions, the hooks, the hashtags, the platform quirks. You just approve and post.",
        'what_bq': 'The number of platforms you show up on is a distribution multiplier. Same content, 5x reach — for the cost of 15 extra minutes a day. Once the pipeline is built, it never stops paying.',
        'what_p3': 'This is that pipeline.',
        'lead_magnet': 'lead-magnets/ship-post-content-guide.html',
    },
    {
        'slug': 'sid-carousels',
        'title': 'The SID Process for Carousels',
        'meta_desc': 'How I script + design 10-slide carousels in under an hour. The exact skill-driven workflow.',
        'kicker': 'CLAUDE CODE · CAROUSELS',
        'h1_pre': 'The SID Process for',
        'h1_accent': 'Carousels',
        'lede': "How I script, design, and ship a 10-slide carousel in under 60 minutes — using the SID process and a Claude Code skill chain.",
        'callout': "Script → Ideate → Design. Three steps, one hour, one carousel that actually stops the scroll. This is the exact workflow.",
        'inside': [
            ('✍️', 'The SID framework — Script, Ideate, Design — in plain English'),
            ('🎯', 'The hook patterns that make people swipe to slide 2'),
            ('🖼️', 'The Claude Code + Canva skill chain that renders the slides'),
            ('🔁', 'The batch: how I produce 5 carousels in one Sunday session'),
        ],
        'dl_items': [
            ('sid-framework.md', 'the Script / Ideate / Design breakdown with examples'),
            ('carousel-skill.md', 'the Claude Code skill I trigger to draft all 10 slides'),
            ('canva-template-notes.md', 'the design system that ships every carousel on-brand'),
        ],
        'dl_folder': 'sid-carousels',
        'what_p1': "Carousels are the highest-leverage post format on IG and LinkedIn right now — and they're also the format most people quit at, because designing 10 slides sounds like a full day of work.",
        'what_p2': "It isn't, if you have the SID process. Script the message, ideate the slides, design once. Claude Code drafts the copy, the Canva template does the rest. Under an hour, start to shipping.",
        'what_bq': "One well-built carousel outperforms a week of reels for reach and saves. The moat isn't design skill — it's the workflow that lets you ship them consistently.",
        'what_p3': 'This is that workflow.',
        'lead_magnet': 'lead-magnets/sid-process-carousel-guide.html',
    },
    {
        'slug': 'resume-stack',
        'title': '4 Claude Skills That Make Your Resume Unrejectable',
        'meta_desc': 'Four Claude skills that turn a resume that isn\'t landing offers into one that clears the ATS, matches recruiter keywords, and reads like the top 5% of candidates.',
        'kicker': 'CLAUDE · RESUME',
        'h1_pre': '4 Claude skills that make your resume',
        'h1_accent': 'unrejectable',
        'lede': 'Run 4 skills in order — Diagnoser, Recruiter, Rewriter, Hiring Manager — and turn a resume that isn\'t landing offers into one that actually clears the ATS.',
        'callout': "Most people paste their resume into ChatGPT, type 'make this better,' and wonder why nothing changes. This is the actual loop top candidates run before applying anywhere.",
        'inside': [
            ('🔍', 'The Diagnoser — scans your resume the way an ATS would'),
            ('🕵️', 'The Recruiter — the keywords showing up in live job posts right now'),
            ('✏️', "The Rewriter — every bullet on Google's XYZ formula"),
            ('🎤', 'The Hiring Manager — realistic mock interview + hireability score'),
        ],
        'dl_items': [
            ('resume-diagnoser.md', 'the ATS diagnostic skill'),
            ('resume-recruiter.md', 'the missing-keywords + trending-skills scan'),
            ('resume-rewriter.md', "the XYZ-formula bullet rewriter"),
            ('resume-hiring-manager.md', 'the mock-interview + scoring skill'),
        ],
        'dl_folder': 'resume-stack',
        'what_p1': "Applying to jobs is a numbers game. Everybody knows that. Nobody wants to spend 45 minutes tailoring one resume — so most people send the same generic version to 30 places and get ghosted.",
        'what_p2': "This stack is the fix. Four Claude skills. Diagnose the structural issues, pull the keywords recruiters actually search, rewrite every bullet on Google's XYZ formula, then rehearse the interview with the actual hiring manager.",
        'what_bq': "The people getting interviews aren't better candidates. They're running a loop. This guide is the loop.",
        'what_p3': 'Install once. Reuse every time you job-hunt.',
        'lead_magnet': 'lead-magnets/resume-skills-guide.html',
    },
    {
        'slug': '6-agent-stack',
        'title': '6-Subagent Stack for Content',
        'meta_desc': 'The subagent architecture I use to research, hook, script, visualize, and post — all in one command.',
        'kicker': 'CLAUDE CODE · SUBAGENTS',
        'h1_pre': '6-Subagent Stack for',
        'h1_accent': 'Content',
        'lede': "The subagent architecture I run every day: research, hook, script, visualize, edit, and post — all triggered by one command in Claude Code.",
        'callout': "Six subagents, one command. This is the architecture that turns 'I need to make a video' into a shot-ready script and thumbnail in under 15 minutes.",
        'inside': [
            ('🔬', 'The research agent — pulls trends, news, and competitor wins'),
            ('🎣', 'The hook agent — writes 10 hook variants ranked by pattern'),
            ('📝', 'The script agent — beat-by-beat script with retention points'),
            ('🎨', 'The visualize + post agents — thumbnail, captions, and platform-ready output'),
        ],
        'dl_items': [
            ('subagent-map.md', 'the architecture diagram + how the agents hand off'),
            ('subagent-configs.md', 'the 6 subagent configs you drop in ~/.claude/agents/'),
            ('one-command-runner.md', 'the parent command that fires the whole stack'),
        ],
        'dl_folder': '6-agent-stack',
        'what_p1': 'Making content should not be six browser tabs, four apps, and a Google Doc. Every step — research, hook, script, thumbnail, caption, post — is a distinct job that a subagent can own.',
        'what_p2': "This guide is the architecture I actually run. Six subagents, each with one job, coordinated by one Claude Code command. It turns 'I need to make a video today' into a shot-ready brief in the time it takes to reheat lunch.",
        'what_bq': "The people who ship content daily aren't grinding harder. They've built an assembly line. This is the assembly line.",
        'what_p3': 'You can copy it verbatim.',
        'lead_magnet': 'lead-magnets/6-subagent-stack-guide.html',
    },
    {
        'slug': 'meta-ads-mcp',
        'title': 'Meta Ads MCP Setup',
        'meta_desc': 'Wire the Meta Ads MCP into Claude Code and run your entire ad account from a terminal.',
        'kicker': 'CLAUDE CODE · META ADS',
        'h1_pre': 'Meta Ads MCP',
        'h1_accent': 'Setup',
        'lede': "Wire the Meta Ads MCP into Claude Code and run your entire ad account from a terminal — campaigns, creatives, insights, all in one command.",
        'callout': "Claude Code + the Meta Ads MCP = ad ops from a terminal. This guide is the exact setup, plus the daily commands I run.",
        'inside': [
            ('🔌', 'The exact Meta Ads MCP install — env vars, tokens, permissions'),
            ('🚀', 'The 5 commands I run daily (create, boost, analyze, cut, scale)'),
            ('📊', 'The daily insights pull that flags dead ads before they burn budget'),
            ('🧠', 'The Claude Code prompt patterns that beat the Ads Manager UI'),
        ],
        'dl_items': [
            ('meta-ads-mcp-install.md', 'the install steps, tokens, and permissions checklist'),
            ('daily-commands.md', 'the 5 commands I run every morning'),
            ('scaling-playbook.md', 'the prompt patterns that scale winners without breaking them'),
        ],
        'dl_folder': 'meta-ads-mcp',
        'what_p1': "Meta Ads Manager is one of the worst pieces of software you're paying for. Clicking through 8 menus to duplicate an ad set should not be a job.",
        'what_p2': "The Meta Ads MCP + Claude Code turns that entire operation into a terminal command. Create campaigns, pull insights, kill dead ads, scale winners — all by describing what you want in plain English.",
        'what_bq': 'The advertisers making money in 2026 are not the ones with the biggest budgets. They are the ones with the fastest ops loop. This is that loop.',
        'what_p3': 'This is the setup that gets you there.',
        'lead_magnet': 'lead-magnets/meta-ads-mcp-guide.html',
    },
    {
        'slug': 'shopify-toolkit',
        'title': 'Shopify AI Toolkit',
        'meta_desc': 'The Claude Code + Shopify MCP stack to manage products, orders, and inventory in plain English.',
        'kicker': 'CLAUDE CODE · SHOPIFY',
        'h1_pre': 'Shopify AI',
        'h1_accent': 'Toolkit',
        'lede': "The Claude Code + Shopify MCP stack that manages products, orders, and inventory in plain English — no more clicking through the admin.",
        'callout': "Your Shopify admin is slow. Claude Code + the Shopify MCP is not. This is the setup that makes running the store feel like talking to an operator.",
        'inside': [
            ('🛒', 'The Shopify MCP install + auth in under 5 minutes'),
            ('📦', 'Bulk product edits, inventory audits, order lookups — one command each'),
            ('💰', 'The daily revenue + inventory brief I get every morning'),
            ('🔁', 'The reorder + restock automations that run themselves'),
        ],
        'dl_items': [
            ('shopify-mcp-install.md', 'the auth setup and API scope checklist'),
            ('daily-brief.md', 'the morning revenue + inventory command'),
            ('bulk-ops.md', 'the 5 bulk operations that save 4 hrs/wk'),
        ],
        'dl_folder': 'shopify-toolkit',
        'what_p1': 'The Shopify admin is fine for small stores. Once you have more than 50 SKUs and daily orders, the click-through cost becomes the single biggest tax on your time.',
        'what_p2': "This toolkit is the exit. Claude Code + the Shopify MCP lets you manage products, inventory, orders, and customer lookups by describing what you want. Bulk edits that take 45 minutes in the UI take 20 seconds in a terminal.",
        'what_bq': "The store owners winning in 2026 aren't the ones with the prettiest theme. They're the ones who cut ops down to minutes a day. This toolkit is how.",
        'what_p3': 'This is the setup.',
        'lead_magnet': 'lead-magnets/shopify-ai-toolkit-guide.html',
    },
    {
        'slug': 'courses-roadmap',
        'title': 'Anthropic Courses Guide',
        'meta_desc': "The roadmap through Anthropic's free courses — what to skip, what to master, in what order.",
        'kicker': 'ANTHROPIC · COURSES',
        'h1_pre': 'Anthropic Courses',
        'h1_accent': 'Roadmap',
        'lede': "Anthropic put out 12+ free courses on Claude, prompt engineering, and agents. Most people finish two and quit. This guide is the order that actually pays off.",
        'callout': "Free doesn't mean random. This is the order to run the Anthropic courses in — what to skip, what to master, what actually compounds.",
        'inside': [
            ('🗺️', 'The full course map — 12+ courses ranked by ROI, not difficulty'),
            ('⏭️', 'What to skip (2 of them are outdated and eat a weekend)'),
            ('🎯', 'The 3 courses that unlock 80% of the value — start here'),
            ('🧠', 'The learning loop: course → build → ship, in that order'),
        ],
        'dl_items': [
            ('courses-map.md', 'the full ranked course list with time estimates'),
            ('start-here.md', 'the 3-course starter path — 4 hours total'),
            ('build-checklist.md', 'the projects to ship after each course to make it stick'),
        ],
        'dl_folder': 'courses-roadmap',
        'what_p1': "Anthropic's courses are the best free education on Claude that exists. But there are 12+ of them, and no signal on which order to attack them in.",
        'what_p2': "I did all of them. This guide is the map — what to skip (2 are outdated), what to master (3 unlock most of the value), and the build-after-each-course loop that turns watching into shipping.",
        'what_bq': 'A course you finish and never build against is a course you paid for with time and got nothing from. The map is what turns free content into real skill.',
        'what_p3': 'This is that map.',
        'lead_magnet': 'lead-magnets/anthropic-courses-guide.html',
    },
    {
        'slug': 'headroom',
        'title': 'Kill Your Claude Code Bill by 92%',
        'meta_desc': "The no-terminal way to cut your Claude Code bill 60–95%. Copy a GitHub link, paste one prompt, let Claude install it for you.",
        'kicker': 'CLAUDE CODE · HEADROOM',
        'h1_pre': 'Kill Your Claude Code Bill by',
        'h1_accent': '92%',
        'lede': "A Netflix engineer just gave away the tool that stops Claude from charging you for the same context over and over. No coding. No terminal. You paste one link into Claude Code and it installs itself.",
        'callout': "Copy the GitHub link. Paste the prompt. Let Claude Code install it for you. 5 minutes, 60–95% savings, no config files, no terminal wizardry required.",
        'inside': [
            ('💸', "Why Claude keeps charging you for the same stuff — the context tax, in plain English"),
            ('🔗', 'The GitHub link + the exact prompt to paste into Claude Code'),
            ('📉', 'The receipts: 92% fewer tokens, zero drop in answer quality'),
            ('🧠', "The learn mode that makes Claude smarter every time you use it"),
        ],
        'dl_items': [
            ('headroom-install.md', 'the one-line install + wrap command for Claude Code'),
            ('headroom-modes.md', 'wrap vs proxy vs library — which one to pick'),
            ('headroom-learn.md', 'the CLAUDE.md learn mode setup, step by step'),
        ],
        'dl_folder': 'headroom',
        'what_p1': "Every time your coding agent reads a file, runs a command, or pulls a search result, that whole wall of text gets stuffed back into the model on every message after. That's the quiet reason your Max plan drains at noon and your API bill hits 3 figures by lunch.",
        'what_p2': "Headroom is a free open-source proxy from Tejas Chopra (Netflix engineer). It sits between Claude Code and the model, compresses context before it costs a token, and caches originals locally so nothing is lost. One install. One command. 60–95% fewer tokens.",
        'what_bq': "Everyone's talking about the 92% number. Nobody's talking about learn mode — Headroom writes fixes straight into your CLAUDE.md so your agent stops repeating mistakes. That's the actual moat.",
        'what_p3': 'This is the setup.',
        'lead_magnet': 'lead-magnets/headroom-guide.html',
    },
    {
        'slug': 'morning',
        'title': 'Your Morning, on Autopilot',
        'meta_desc': 'The /morning skill runs your daily briefing before you sit down — email triage + drafts, the news that matters to your niche, and your top priorities.',
        'kicker': 'CLAUDE CODE · MORNING',
        'h1_pre': 'Your Morning, on',
        'h1_accent': 'Autopilot',
        'lede': "The Claude Code skill that runs your daily briefing before you sit down — inbox triaged with replies drafted, the news that matters to your niche, and your top 3 priorities on the screen.",
        'callout': "Install once. Ask Claude 'tell me about my morning skill.' Rewire the news module to your niche in plain English. Schedule it. Your first hour stops being a scramble.",
        'inside': [
            ('☕', 'The 4 modules — email triage + drafts, niche news, top 3 priorities, account stats'),
            ('🔧', 'The one command that unlocks it: <em>"Tell me about my morning skill"</em>'),
            ('🎯', 'Swap AI news for <strong>your niche</strong> — real estate, ecom, fitness, whatever you run'),
            ('⏰', 'Schedule it to fire at 7am so the brief is waiting when you sit down'),
        ],
        'dl_items': [
            ('morning-skill.md', 'the SKILL.md — drop into ~/.claude/skills/morning/'),
            ('personalize-prompts.md', 'the exact prompts to rewire the news module to any niche'),
            ('schedule-setup.md', 'how to wire /morning to fire every weekday at 7am'),
        ],
        'dl_folder': 'morning',
        'what_p1': "Your first hour decides your day. Most people spend theirs inside 40 unread emails and 12 Twitter tabs, then wonder why they were reacting instead of executing by 10am.",
        'what_p2': "The /morning skill is the fix. It runs the boring parts before you sit down — triages the inbox, drafts the replies that matter, pulls the news for your niche, lays out your top 3. You open the laptop to a brief, not a firehose.",
        'what_bq': "The best part isn't the default setup. It's the one command — <em>'tell me about my morning skill'</em> — that lets you rewire any module (news, priorities, drafts) to your business in plain English. My skill becomes your skill.",
        'what_p3': 'This is the exact setup, and the exact prompts to personalize it.',
        'lead_magnet': 'lead-magnets/morning-guide.html',
    },
    {
        'slug': 'routines',
        'title': 'Routines: Automate Your Day',
        'meta_desc': 'The Claude Code /routines setup that runs my mornings — email, news, priorities, on autopilot.',
        'kicker': 'CLAUDE CODE · ROUTINES',
        'h1_pre': 'Routines: Automate',
        'h1_accent': 'Your Day',
        'lede': "The Claude Code /routines setup that runs my mornings. Email triaged, AI news summarized, daily priorities laid out — all before I open my laptop.",
        'callout': "Your morning shouldn't start with 40 unread emails. This routine kills the noise before you sit down.",
        'inside': [
            ('☕', 'The morning routine: email triage + news brief + daily priorities in one command'),
            ('⏰', 'The cron-scheduled /routines that fire at 7am while you sleep'),
            ('📬', 'The Gmail scan pattern that surfaces the 3 emails that actually matter'),
            ('🧠', 'The evening close-out that preps tomorrow before you shut down'),
        ],
        'dl_items': [
            ('morning-routine.md', 'the 7am /routines that runs email + news + priorities'),
            ('evening-close.md', 'the shutdown routine that preps tomorrow'),
            ('cron-setup.md', 'the scheduling — how to wire /routines to fire automatically'),
        ],
        'dl_folder': 'routines',
        'what_p1': "Your morning does not need to start with a firehose. Email, news, calendar, priorities — every one of them is a job that a routine can run before you're even awake.",
        'what_p2': "This guide is the /routines setup I actually use. By the time I sit down at 8am, my inbox is triaged, the AI news is summarized to 5 bullets, and my top 3 for the day are on the screen. That's the whole thing.",
        'what_bq': "The people who stay sharp for 10 hours a day aren't superhuman. They start the day already ahead. This routine is how you get there.",
        'what_p3': 'You can copy the setup verbatim.',
        'lead_magnet': 'lead-magnets/routines-guide.html',
    },
    {
        'slug': 'higgs-field-claude',
        'title': 'Connect Higgs Field to Claude',
        'meta_desc': 'Wire Higgs Field into Claude via MCP and generate UGC video ads, IG carousels, Meta creatives, and product shots from a chat window. 2-minute setup.',
        'kicker': 'CLAUDE · HIGGS FIELD',
        'h1_pre': 'Generate Ads Inside',
        'h1_accent': 'Claude',
        'lede': "Higgs Field makes UGC video ads, product shots, IG carousels, and Meta creatives. Wire it to Claude via MCP and you never leave the chat to build a marketing asset again.",
        'callout': "One MCP link. One custom connector. Upload a product and ask Claude for 10 UGC ads — you'll see why this changes everything.",
        'inside': [
            ('🎬', 'The 2-minute MCP setup — sign up, copy link, paste in Claude'),
            ('📸', 'What Higgs Field ships: UGC video ads, carousels, Meta creatives, product shots'),
            ('⚡', '5 copy-paste prompts to run today — pick one, ship one'),
            ('🧠', "The Higgs Field + ChatGPT combo that covers every asset an agency would ship"),
        ],
        'dl_items': [
            ('higgs-field-setup.md', 'the 3-step MCP install for Claude'),
            ('higgs-field-prompts.md', 'the 5 prompts I run on every product — UGC, carousels, ads, shots, brand kit'),
            ('higgs-field-brand-upload.md', 'the assets to upload once so every prompt lands on-brand'),
        ],
        'dl_folder': 'higgs-field',
        'what_p1': "Every founder I know has the same problem: they need UGC ads, carousels, product shots, and Meta creatives — and they're stitching together 4 tools and 6 tabs to get one asset out.",
        'what_p2': "Higgs Field ships all of that from one platform. Connect it to Claude via MCP and Claude runs it for you. You upload a product once, ask for 10 UGC ads, and the whole batch appears in the chat. Then carousels. Then product shots. From a chat window.",
        'what_bq': "The moat isn't 'AI generates content.' The moat is a chat window that ships every asset a marketing agency would ship — UGC, static, video, brand system — without leaving the conversation.",
        'what_p3': 'This is that setup.',
        'lead_magnet': 'lead-magnets/higgs-field-claude-guide.html',
    },
    {
        'slug': 'md-file-builder',
        'title': 'MD File Builder — The Full Claude Prompt',
        'meta_desc': 'The prompt that interviews you 425 times, then compiles one about-me.md file every AI reads like it already knows you.',
        'kicker': 'CLAUDE · CONTEXT',
        'h1_pre': 'MD File',
        'h1_accent': 'Builder',
        'lede': "The prompt that turns Claude into your personal interviewer. 425 questions on who you are, how you work, and what good looks like — then one .md file every AI reads like it already knows you.",
        'callout': "Build the file once. Drop it into Claude, ChatGPT, Gemini. Stop re-explaining yourself at the start of every session.",
        'inside': [
            ('🧠', 'What this prompt actually does — and why one file beats 100 prompts'),
            ('⚡', 'The 60-second setup: new chat, paste, answer honestly'),
            ('🎙️', 'The three commands: <code class="inline">pause</code>, <code class="inline">skip</code>, <code class="inline">compile now</code>'),
            ('📄', 'The full 425-question interview prompt, copy-paste ready'),
        ],
        'dl_items': [
            ('md-file-builder-prompt.md', 'the full 425-question interview prompt, copy-paste ready'),
            ('about-me-template.md', 'the output structure Claude compiles at the end'),
            ('bend-the-prompt.md', 'the one-liners that weight the interview toward your real job'),
        ],
        'dl_folder': 'md-file-builder',
        'what_p1': "Every new chat, you retype your background, your stack, your voice. The AI half-listens. The output drifts. You get bored explaining and start cutting corners.",
        'what_p2': "This prompt fixes that. Claude interviews you 425 times — identity, work, voice, hard nos, how you want AI to behave — and compiles one about-me.md file. Drop it into any AI and every conversation starts on-voice, on-context, on-rails.",
        'what_bq': "The gap between people who prompt well and people who prompt badly is 90% context. This closes the gap in one deep session.",
        'what_p3': 'Build the file once. Never re-explain yourself again.',
        'lead_magnet': 'lead-magnets/md-file-builder-guide.html',
    },
    {
        'slug': 'content-agent-dashboard',
        'title': 'Build Your Content Agent Dashboard',
        'meta_desc': 'The Claude Code prompt that walks you through building a 5-agent content dashboard — Apify data pull, live dashboard, Telegram digest. Copy, paste, ship.',
        'kicker': 'CLAUDE CODE · AGENTS',
        'h1_pre': 'Your Content Agent',
        'h1_accent': 'Dashboard',
        'lede': "One prompt into Claude Code. Real Instagram + competitor data via Apify. A dashboard showing 5 agents — Ideator, Hook & Script, Planner, Analyst, DM Manager. A Telegram bot that lands the digest on your phone. No black boxes.",
        'callout': "Paste one prompt. Claude walks you through the build one step at a time — data pull, dashboard, Telegram, schedule. You stay in the driver's seat.",
        'inside': [
            ('🧠', 'The full copy-paste prompt — Claude builds it <em>with</em> you, not for you'),
            ('📡', 'The Apify pull that ranks your real posts + competitor wins by views'),
            ('📊', 'The 5-agent dashboard: Ideator · Hook & Script · Planner · Analyst · DM Manager'),
            ('📱', 'The Telegram bot that ships the weekly digest to your phone on autopilot'),
        ],
        'dl_items': [
            ('content-agent-prompt.md', 'the full one-shot prompt, copy-paste ready'),
            ('apify-scraper-notes.md', 'the Apify actor + resultsType settings that get your top post right'),
            ('telegram-bot-setup.md', 'the BotFather → token → .env flow, step by step'),
        ],
        'dl_folder': 'content-agent-dashboard',
        'what_p1': 'Most creators run content ops out of a Google Doc, a Notes app, and vibes. It works until it doesn\'t — and it never scales past you.',
        'what_p2': "This guide gives you the exact prompt I use to spin up a full content ops stack in Claude Code. Real IG data, live dashboard, 5 agents on one screen, Telegram digest to your phone, weekly cron. One prompt. One afternoon.",
        'what_bq': "The moat isn't the dashboard. It's that once the loop is running, you get a weekly report on what worked and what didn't — and the Ideator + Analyst adjust off it automatically. Feedback loops beat willpower.",
        'what_p3': 'This is that loop.',
        'lead_magnet': 'lead-magnets/content-agent-dashboard-guide.html',
    },
    {
        'slug': 'finance-agents',
        'title': "Claude's Finance Agents",
        'meta_desc': "Anthropic shipped 10 finance agents. Three of them turn Claude into your personal Wall Street desk. The 5-minute install + the exact prompts.",
        'kicker': 'CLAUDE · FINANCE AGENTS',
        'h1_pre': "Claude's Finance",
        'h1_accent': 'Agents',
        'lede': "Anthropic quietly shipped 10 finance agent templates. Three of them turn your laptop into the closest thing regular people have ever had to a Wall Street desk. This guide is the 5-minute install and the exact prompts.",
        'callout': "Wall Street tools. Zero jargon. If you can copy-paste a link, you can run this. No code, no terminal, no analyst degree.",
        'inside': [
            ('📈', 'The <strong>Market Researcher</strong> — watches every stock you own, 24/7'),
            ('📊', 'The <strong>Model Builder</strong> — builds full financial models in Excel from scratch'),
            ('🎧', 'The <strong>Earnings Reviewer</strong> — reads 90-minute earnings calls in seconds'),
            ('⚡', 'The 5-minute install + the prompt that chains all three into one due-diligence report'),
        ],
        'dl_items': [
            ('finance-agents-guide.md', "the full guide — setup, prompts, and the due-diligence chain"),
            ('install-checklist.md', "the copy-paste install steps + the three GitHub links"),
            ('prompt-pack.md', "every prompt in the guide, tested, in one file"),
        ],
        'dl_folder': 'finance-agents',
        'what_p1': "Six months ago, everything in this guide cost a Bloomberg terminal ($24,000/year), an analyst salary ($150,000/year), or both. Today it costs a Claude subscription and five minutes of setup.",
        'what_p2': "Anthropic shipped 10 finance agents in May. Seven are built for the analyst crowd. Three of them — Market Researcher, Model Builder, Earnings Reviewer — are the exact stack a regular investor would want. This guide is the install, the prompts, and the chain that runs all three as one due-diligence report.",
        'what_bq': "The playing field didn't level. It cratered. The tools regular people can run at home are the same tools professionals paid six figures for in 2024. The 'I can't do my own research' excuse just died.",
        'what_p3': "This is the setup.",
        'lead_magnet': 'lead-magnets/finance-agents-guide.html',
    },
    {
        'slug': 'employee-context',
        'title': 'Your Job. Loaded. Into Claude.',
        'meta_desc': 'The prompt that builds a CLAUDE.md + reference folder so the AI knows your role, your company, your audience, and your voice before you type a single message.',
        'kicker': 'CLAUDE · FOR EMPLOYEES',
        'h1_pre': 'Your Job. Loaded.',
        'h1_accent': 'Into Claude.',
        'lede': "The prompt that interviews you across 7 sections and 175 questions, then compiles a 125-line CLAUDE.md summary plus a full reference folder (business, avatars, voice). Your role loaded once, forever.",
        'callout': "One 125-line CLAUDE.md + three deep reference files the AI opens only when needed. Stop pasting your job description into every new chat.",
        'inside': [
            ('🧠', 'The 4-file system: <code class="inline">CLAUDE.md</code> + business + avatars + voice'),
            ('🗂️', 'The routing rules that tell the AI which file to open when'),
            ('⚡', 'The 7-section, 175-question interview that fills them all in'),
            ('📄', 'The full prompt, copy-paste ready'),
        ],
        'dl_items': [
            ('employee-context-prompt.md', 'the full 175-question interview prompt'),
            ('claude-md-template.md', 'the 125-line summary structure the AI loads every session'),
            ('reference-folder-template.md', 'the three reference file skeletons: business, avatars, voice'),
        ],
        'dl_folder': 'employee-context',
        'what_p1': "If you work at a company, half of every AI chat is you re-explaining your role, your product, your team, your customers, your writing style. Every single time.",
        'what_p2': "This prompt fixes it. Claude interviews you across 7 sections — you and your role, the company, your work, your team, your audience, your voice, and how you want AI to behave. Then it compiles a 125-line CLAUDE.md summary plus three deep reference files the AI only opens when the question needs them.",
        'what_bq': "125 lines loads on every message for pennies. The full 1000-line context only pulls when it's actually needed. Same quality, fraction of the tokens.",
        'what_p3': 'Build the files once. Load them into every future project.',
        'lead_magnet': 'lead-magnets/employee-context-guide.html',
    },
    {
        'slug': 'llm-council',
        'title': 'The LLM Council',
        'meta_desc': 'The free Claude skill that runs any decision past 5 independent AI advisors — anonymous peer review, one clear verdict. 30-second install, no code.',
        'kicker': 'CLAUDE · DECISIONS',
        'h1_pre': 'The LLM',
        'h1_accent': 'Council',
        'lede': "The free Claude skill that runs any big call past 5 independent AI advisors, makes them tear each other's answers apart anonymously, and hands you one clear verdict — not 'it depends.'",
        'callout': "One AI gives you one confident answer with zero way to tell if it's quietly wrong. The Council gives you five takes, a blind peer review, and a chairman who forces a decision. 30 seconds to install.",
        'inside': [
            ('🧠', 'How the Council works — 5 parallel advisors, blind peer review, one verdict'),
            ('👥', 'The 5 advisors: Contrarian, First Principles, Expansionist, Outsider, Executor'),
            ('⚡', 'The 30-second install + all 7 trigger phrases'),
            ('💰', 'Copy-paste prompts for pricing, hiring, firing clients, and landing pages'),
        ],
        'dl_items': [
            ('llm-council-guide.html', 'the full guide — how it works, install, prompt library'),
        ],
        'dl_folder': 'llm-council',
        'what_p1': "You ask one AI one question and get one confident answer — even when it's missing something obvious. For your pricing, your positioning, whether to take the deal, that's a trap.",
        'what_p2': "The LLM Council fixes it with structure: five independent advisors answer in parallel, review each other's answers blind, and a chairman synthesizes one clear verdict with a single next step.",
        'what_bq': "Where the council agrees is your green light. Where it clashes is the exact spot smart thinking genuinely splits — that's where you slow down and dig.",
        'what_p3': 'This is the whole system, plus the prompts to run it on.',
        'lead_magnet': 'lead-magnets/llm-council-guide.html',
    },
    {
        'slug': 'skills-setup',
        'title': 'Build Your Own Claude Code Skills',
        'meta_desc': 'The non-tech setup guide. Zero coding. From a blank Terminal to your first working Claude Code skill — plus 3 you can steal.',
        'kicker': 'CLAUDE CODE · SETUP',
        'h1_pre': 'Build Your Own',
        'h1_accent': 'Claude Code Skills',
        'lede': "The non-tech setup guide. Zero coding required. From a blank Terminal to your first working skill — plus 3 stealable skills you can copy-paste and run today.",
        'callout': "A skill is a saved employee, not a saved prompt. You write instructions once, in plain English, and Claude runs the same job the same way every time. This guide is the whole install.",
        'inside': [
            ('🧠', 'What a skill actually is — plain English, no dev-speak'),
            ('⚡', 'Installing Claude Code from zero (Mac or Windows)'),
            ('🎯', 'The <code class="inline">SKILL.md</code> anatomy + trigger description formula'),
            ('🧩', '3 stealable skills — copy, paste, run today'),
        ],
        'dl_items': [
            ('skills-setup-guide.html', 'the full setup guide — install, folder, SKILL.md, test'),
            ('weekly-review.md', 'the Friday review skill — steal it'),
            ('client-recap.md', 'the after-call recap skill — steal it'),
        ],
        'dl_folder': 'skills-setup',
        'what_p1': "Most business owners open Claude Code, type a prompt, get a decent answer, and then type the same prompt again tomorrow. Different wording, same idea. That's the trap — you're paying a tax in time and quality every single day.",
        'what_p2': "A skill is the fix. It's a folder on your computer with one file in it that tells Claude how to do a specific job — the steps, the format, the tools. You type a slash command, Claude runs the SOP. You didn't code anything. You just wrote the instructions once.",
        'what_bq': "The people you're watching online who look 10x faster aren't prompting harder. They built skills. The prompts live in files now — and that's the entire gap.",
        'what_p3': 'This guide closes that gap.',
        'lead_magnet': 'lead-magnets/skills-setup-guide.html',
    },
]

# ---- load template ----
with open(TEMPLATE_PATH) as f:
    tpl = f.read()

# Unique anchors from first-skill.html — we replace by exact match.
# Find them once, then substitute per guide.

REPLACEMENTS_FIRST_SKILL = {
    # <title> + meta
    '<title>Build Your First Claude Code Skill — Karemops.ai</title>': '<title>{title} — Karemops.ai</title>',
    '<meta name="description" content="A 30-second walkthrough on shipping your first Claude Code skill. Free guide, drop-in ready." />': '<meta name="description" content="{meta_desc}" />',
    '<meta property="og:title" content="Build Your First Claude Code Skill — Karemops.ai" />': '<meta property="og:title" content="{title} — Karemops.ai" />',
    '<meta property="og:description" content="A 30-second walkthrough on shipping your first Claude Code skill. Free guide, drop-in ready." />': '<meta property="og:description" content="{meta_desc}" />',

    # Hero kicker + H1
    '<div class="kicker">CLAUDE CODE · SKILLS</div>': '<div class="kicker">{kicker}</div>',
    '<h1>Build Your First <span class="accent">Skill</span></h1>': '<h1>{h1_pre} <span class="accent">{h1_accent}</span></h1>',

    # Lede + callout
    '    The 30-second walkthrough on shipping your first Claude Code skill.\n    Drop-in ready. No fluff, no theory — just the file, the folder, and the exact prompt to test it works.': '    {lede}',
    '    <p>One skill fixes one job. This guide gives you the file, the folder, and the pattern I stole to build every skill after it.</p>': '    <p>{callout}</p>',
}


def slugify(s):
    return s


def build_inside(items):
    lines = []
    for em, text in items:
        lines.append(f'      <li><span class="em">{em}</span><span>{text}</span></li>')
    return '\n'.join(lines)


FIRST_SKILL_INSIDE = '''      <li><span class="em">🧠</span><span>The 4-line skill template — the entire structure in one file</span></li>
      <li><span class="em">⚡</span><span>30-second drop-in install into <code class="inline">~/.claude/skills/</code></span></li>
      <li><span class="em">🎯</span><span>The exact prompt pattern I use to trigger skills reliably</span></li>
      <li><span class="em">🧩</span><span>3 skills I built this week you can copy verbatim</span></li>'''


FIRST_SKILL_DL_SECTION = '''    <h2>📥 Download the Skill Files</h2>
    <p>Right-click each link and <strong>Save Link As…</strong> — or click to preview, then download.</p>
    <ul class="dl-list">
      <li>📄 <a href="/lead-magnets/first-skill-guide.html">first-skill.md</a> — the base template you copy for every new skill</li>
      <li>📄 <a href="/lead-magnets/first-skill-guide.html">install-notes.md</a> — the 30-second setup and where files live</li>
      <li>📄 <a href="/lead-magnets/first-skill-guide.html">test-prompts.md</a> — the exact prompts I use to verify a skill fires</li>
    </ul>
    <p style="margin-top:14px;">
      Drop all three into <code class="inline">~/.claude/skills/</code>
      (each in its own folder: <code class="inline">~/.claude/skills/first-skill/SKILL.md</code>)
      and restart Claude Code. Done.
    </p>'''


def build_dl_section(guide):
    lm = guide['lead_magnet']
    folder = guide['dl_folder']
    items_html = '\n'.join(
        f'      <li>📄 <a href="/{lm}">{fname}</a> — {desc}</li>'
        for fname, desc in guide['dl_items']
    )
    first_fname = guide['dl_items'][0][0]
    return f'''    <h2>📥 Download the Files</h2>
    <p>Right-click each link and <strong>Save Link As…</strong> — or click to preview, then download.</p>
    <ul class="dl-list">
{items_html}
    </ul>
    <p style="margin-top:14px;">
      Drop these into <code class="inline">~/.claude/skills/{folder}/</code>
      (with the main file as <code class="inline">~/.claude/skills/{folder}/SKILL.md</code>)
      and restart Claude Code. Done.
    </p>'''


FIRST_SKILL_WHAT_SECTION = '''    <h2>What This Is</h2>
    <p>
      This is the shortest possible on-ramp to Claude Code skills. One file. One folder. One prompt to test it.
    </p>
    <p>
      Skills are the reason Claude Code stops being a chatbot and starts being an operator. Once you ship the first one, the pattern is obvious — you'll build the next five in a day. This guide gets you across the first line.
    </p>
    <blockquote>
      The moment I shipped my first skill, my agency's workflow changed. Content, ad ops, client research —
      all of it turned into <em>one command</em>. That's the leverage. This guide is how you get it.
    </blockquote>
    <p>This is that shortcut.</p>'''


def build_what_section(guide):
    return f'''    <h2>What This Is</h2>
    <p>{guide["what_p1"]}</p>
    <p>{guide["what_p2"]}</p>
    <blockquote>{guide["what_bq"]}</blockquote>
    <p>{guide["what_p3"]}</p>'''


FIRST_SKILL_GUIDE_JS = '''  const GUIDE = {
    title: "Build Your First Claude Code Skill",
    href: "https://www.karemopsai.com/lead-magnets/first-skill-guide.html"
  };'''


def build_guide_js(guide):
    return f'''  const GUIDE = {{
    title: "{guide["title"]}",
    href: "{BASE}/{guide["lead_magnet"]}"
  }};'''


for g in GUIDES:
    out = tpl

    # Basic string swaps
    for old, new_tpl in REPLACEMENTS_FIRST_SKILL.items():
        new = new_tpl.format(**g)
        assert old in out, f"missing anchor: {old[:80]} for {g['slug']}"
        out = out.replace(old, new)

    # Multi-line blocks
    inside_new = build_inside(g['inside'])
    assert FIRST_SKILL_INSIDE in out, f"missing inside anchor for {g['slug']}"
    out = out.replace(FIRST_SKILL_INSIDE, inside_new)

    # Download + "What This Is" sections were removed from the template.
    # The `dl_items`, `dl_folder`, `what_p1`, `what_p2`, `what_bq`, `what_p3`
    # fields in each guide config are kept for potential future use, but not rendered.

    js_new = build_guide_js(g)
    assert FIRST_SKILL_GUIDE_JS in out, f"missing js anchor for {g['slug']}"
    out = out.replace(FIRST_SKILL_GUIDE_JS, js_new)

    outpath = os.path.join(OUT_DIR, f"{g['slug']}.html")
    with open(outpath, 'w') as f:
        f.write(out)
    print(f"wrote {outpath}")

print(f"\nGenerated {len(GUIDES)} pages.")
