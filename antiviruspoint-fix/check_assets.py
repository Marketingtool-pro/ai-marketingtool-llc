"""Check every optimized CSS/JS asset the homepage references actually loads.

The page is fetched by resolving antiviruspoint.org to the Hostinger IP, so the
check does not depend on DNS having been switched.
"""
import re
import ssl
import urllib.request
import http.client

HOST = 'antiviruspoint.org'
IP = '77.37.90.129'
PAGE = '/Users/loken/.claude/jobs/29438203/tmp/H6.html'

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def head(path):
    conn = http.client.HTTPSConnection(IP, 443, context=ctx, timeout=25)
    try:
        conn.request('GET', path, headers={'Host': HOST, 'User-Agent': 'Mozilla/5.0'})
        r = conn.getresponse()
        body = r.read()
        return r.status, len(body)
    finally:
        conn.close()


html = open(PAGE, encoding='utf-8', errors='replace').read()
urls = sorted(set(re.findall(
    r'["\']https://antiviruspoint\.org(/wp-content/litespeed/(?:css|js)/[^"\']+)', html)))

print('optimized assets referenced: %d\n' % len(urls))
bad = []
total = 0
for u in urls:
    try:
        code, size = head(u)
    except Exception as exc:
        code, size = 'ERR', 0
        print('  %-6s %s (%s)' % (code, u.split('/')[-1][:34], exc))
        bad.append(u)
        continue
    total += size
    flag = '' if (code == 200 and size > 0) else '   <-- PROBLEM'
    if flag:
        bad.append(u)
    print('  %-4s %8d B  %s%s' % (code, size, u.split('/')[-1][:38], flag))

print('\ntotal asset bytes: %.1f KB' % (total / 1024))
print('broken assets    : %d' % len(bad))
print('RESULT: %s' % ('ALL ASSETS OK' if not bad else 'BROKEN ASSETS PRESENT'))
