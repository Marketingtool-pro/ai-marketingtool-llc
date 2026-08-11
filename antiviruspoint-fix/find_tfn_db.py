"""Locate the wrong toll-free number inside the wpcomstaging database dump.

Wrong number currently on the site : +1-877-593-4465  (digits 8775934465)
Correct number confirmed by owner  : +1-855-535-7753  (digits 8555357753)

Reports which table, and which option_name / meta_key holds it, so the change
can be made in exactly the right place instead of a blind search-and-replace.
"""
import re

BASE = '/Users/loken/.claude/jobs/29438203/tmp/sql/'
WRONG = '8775934465'
TABLES = ['fqsi_options.sql', 'fqsi_postmeta.sql', 'fqsi_posts.sql']


def scan(fname):
    path = BASE + fname
    with open(path, encoding='utf-8', errors='replace') as fh:
        data = fh.read()

    total = data.count(WRONG)
    print('=== %s ===' % fname)
    print('  file size      : %.1f MB' % (len(data) / 1048576))
    print('  hits for %s : %d' % (WRONG, total))
    if not total:
        return

    # Show a tight window around each hit, and try to recover the owning key.
    for m in list(re.finditer(re.escape(WRONG), data))[:12]:
        start = max(0, m.start() - 400)
        window = data[start:m.end() + 120]

        # option_name is the token right after the row's opening paren/comma
        keys = re.findall(r"'([A-Za-z0-9_\-\[\]]{3,60})'\s*,", window)
        key = keys[-1] if keys else '?'

        snippet = data[max(0, m.start() - 60):m.end() + 60]
        snippet = re.sub(r'\s+', ' ', snippet)
        print('   • nearest key: %-32s | ...%s...' % (key, snippet))
    print()


for t in TABLES:
    try:
        scan(t)
    except FileNotFoundError:
        print('missing', t)
