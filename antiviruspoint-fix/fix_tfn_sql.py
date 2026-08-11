"""Swap the toll-free number in the wpcomstaging SQL dump, safely.

    wrong : +1-877-593-4465   (digits 8775934465)
    right : +1-855-535-7753   (digits 8555357753)

WHY A DIGIT-ONLY SWAP
---------------------
The number lives in three kinds of storage:

  1. Serialized PHP  — fqsi_options, option `cnb` (Call Now Button):
         s:6:"number";s:12:"+18775934465";
     Serialized strings carry a byte-length prefix. Replacing the digits keeps
     the string exactly 12 bytes, so the prefix stays correct. Reformatting it
     to "+1-855-535-7753" would make it 15 bytes and silently corrupt the
     option, which is how sites get white-screened by search-and-replace.

  2. URL-encoded inside meta  — Visual Header's `call_textarea`, stored once
     single-encoded and once double-encoded.

  3. Plain / JSON-escaped HTML — Elementor widgets and page content.

Swapping only the 10 digits is byte-for-byte length preserving, so it is safe in
all three without needing to understand each container. Result: "+18555357753"
and "+1-8555357753".

DISPLAY FORMATTING IS DELIBERATELY NOT DONE HERE
------------------------------------------------
Turning "+1-8555357753" into "+1-855-535-7753" changes the byte length and must
therefore be done through the WordPress UI on the handful of visible spots, not
by SQL surgery. The staging site's number is already malformed today
("+1-8775934465"), so formatting is a pre-existing issue, not one this creates.

Usage:
    python3 fix_tfn_sql.py            # report only, writes nothing
    python3 fix_tfn_sql.py --write     # write *.fixed.sql alongside the inputs
"""
import sys
import os
import re

BASE = '/Users/loken/.claude/jobs/29438203/tmp/sql/'
WRONG_DIGITS = '8775934465'
RIGHT_DIGITS = '8555357753'
TABLES = ['fqsi_options.sql', 'fqsi_postmeta.sql', 'fqsi_posts.sql']

WRITE = '--write' in sys.argv

assert len(WRONG_DIGITS) == len(RIGHT_DIGITS), 'replacement must be length-preserving'

print('wrong digits: %s  ->  right digits: %s  (both %d bytes)'
      % (WRONG_DIGITS, RIGHT_DIGITS, len(WRONG_DIGITS)))
print('mode: %s\n' % ('WRITE' if WRITE else 'report only'))

grand = 0
for table in TABLES:
    path = BASE + table
    if not os.path.exists(path):
        print('%-24s MISSING' % table)
        continue

    with open(path, encoding='utf-8', errors='surrogateescape') as fh:
        data = fh.read()

    before_len = len(data)
    hits = data.count(WRONG_DIGITS)
    fixed = data.replace(WRONG_DIGITS, RIGHT_DIGITS)
    after_len = len(fixed)
    grand += hits

    # Safety assertions: nothing may change size, and no wrong digits may remain.
    same_size = (before_len == after_len)
    residual = fixed.count(WRONG_DIGITS)
    now_right = fixed.count(RIGHT_DIGITS)

    print('%-24s hits=%-3d size_unchanged=%-5s residual_wrong=%-3d now_right=%d'
          % (table, hits, same_size, residual, now_right))

    if not same_size:
        print('   ABORT: byte length changed — refusing to write %s' % table)
        continue

    if WRITE and hits:
        out = path.replace('.sql', '.fixed.sql')
        with open(out, 'w', encoding='utf-8', errors='surrogateescape') as fh:
            fh.write(fixed)
        print('   wrote %s' % os.path.basename(out))

    # Verify the serialized option specifically, since it is the risky one.
    if table == 'fqsi_options.sql':
        for m in re.finditer(r's:6:\\?"number\\?";s:(\d+):\\?"([^"\\]+)', fixed):
            declared, value = int(m.group(1)), m.group(2)
            print('   serialized check: declared len=%d actual len=%d value=%s -> %s'
                  % (declared, len(value), value,
                     'OK' if declared == len(value) else 'MISMATCH'))

print('\ntotal replacements: %d' % grand)
if not WRITE:
    print('nothing written — re-run with --write to produce .fixed.sql files')
