#!/usr/bin/env python3
"""Add the site extras script (consult bar + waitlists) to the homepage and every guide page.
Safe to re-run: pages that already have the tag are skipped.
Usage: python3 scripts/add_site_extras.py [files...]   (no args = homepage + all tracked guide pages)
"""
import subprocess, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
TAG = '<!-- km-extras --><script src="/assets/site/km-extras.js" defer></script>'

def targets():
    if len(sys.argv) > 1:
        return [pathlib.Path(a) for a in sys.argv[1:]]
    out = subprocess.run(['git', 'ls-files', 'index.html', 'guides/*.html', 'lead-magnets/*-guide.html'],
                         cwd=ROOT, capture_output=True, text=True, check=True).stdout.split()
    return [ROOT / p for p in out]

added = skipped = 0
for f in targets():
    s = f.read_text(encoding='utf-8')
    if 'km-extras.js' in s:
        skipped += 1; continue
    i = s.rfind('</body>')
    if i < 0:
        print('no </body>:', f); continue
    f.write_text(s[:i] + TAG + '\n' + s[i:], encoding='utf-8')
    added += 1
print(f'added {added}, already had it {skipped}')
