"""Check whether Stripe was already disabled in the pre-migration backup.

Reads the woocommerce_stripe_settings row out of the Jetpack backup's options
dump and reports only the enabled/testmode flags — never the API keys.
"""
import re

DUMP = '/Users/loken/.claude/jobs/29438203/tmp/sql/fqsi_options.sql'

data = open(DUMP, encoding='utf-8', errors='replace').read()

idx = data.find('woocommerce_stripe_settings')
if idx < 0:
    print('woocommerce_stripe_settings not present in the backup dump')
    raise SystemExit

# The serialized array follows the option name; read a bounded window.
window = data[idx:idx + 4000]

for key in ('enabled', 'testmode'):
    # serialized form:  s:7:"enabled";s:2:"no";
    m = re.search(r's:%d:\\?"%s\\?";s:\d+:\\?"([^"\\]*)' % (len(key), key), window)
    print('%-10s : %s' % (key, m.group(1) if m else '(not found)'))

# Report only whether credentials exist, never their values.
for key in ('secret_key', 'publishable_key', 'test_secret_key'):
    m = re.search(r's:%d:\\?"%s\\?";s:(\d+):' % (len(key), key), window)
    if m:
        length = int(m.group(1))
        print('%-16s : %s' % (key, 'SET (%d chars)' % length if length else 'EMPTY'))

print()
print('Also checking which gateways the backup had enabled:')
for gw in ('ppcp-gateway', 'ppcp-card-button-gateway'):
    print('  %-26s present in dump: %s' % (gw, gw in data))
