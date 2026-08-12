"""Spot-check key pages on the migrated Hostinger site.

Resolves antiviruspoint.org to the Hostinger IP directly, so nothing depends on
DNS having been switched yet.
"""
import re
import ssl
import http.client

HOST = 'antiviruspoint.org'
IP = '77.37.90.129'
OLD_TFN = '8775934465'
NEW_TFN = '855-535-7753'

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

PAGES = ['/', '/shop/', '/contact-us/', '/about-us/', '/cart/', '/my-account/']


def get(path):
    conn = http.client.HTTPSConnection(IP, 443, context=ctx, timeout=40)
    try:
        conn.request('GET', path, headers={'Host': HOST, 'User-Agent': 'Mozilla/5.0 Chrome/120'})
        r = conn.getresponse()
        body = r.read()
        loc = r.getheader('Location')
        cache = r.getheader('x-litespeed-cache')
        if r.status in (301, 302) and loc:
            p = loc.split(HOST, 1)[-1] or '/'
            conn.close()
            conn = http.client.HTTPSConnection(IP, 443, context=ctx, timeout=40)
            conn.request('GET', p, headers={'Host': HOST, 'User-Agent': 'Mozilla/5.0 Chrome/120'})
            r = conn.getresponse()
            body = r.read()
            cache = r.getheader('x-litespeed-cache')
        return r.status, body.decode('utf-8', 'replace'), cache
    finally:
        conn.close()


print('%-16s %-5s %-9s %-6s %-6s %-6s %-7s %s' %
      ('PAGE', 'HTTP', 'BYTES', 'OLDTFN', 'NEWTFN', 'BAR', 'GTAG', 'CACHE'))
for p in PAGES:
    try:
        code, html, cache = get(p)
    except Exception as exc:
        print('%-16s ERR   %s' % (p, exc))
        continue
    bar = len(re.findall(r'<p[^>]*woocommerce-store-notice', html))
    print('%-16s %-5s %-9d %-6d %-6d %-6d %-7d %s' % (
        p, code, len(html),
        html.count(OLD_TFN), html.count(NEW_TFN), bar,
        html.count('AW-17518714922'), cache or '-'))
