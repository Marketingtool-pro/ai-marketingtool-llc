"""Find broken images in the footer, header and favicon of the migrated site.

Resolves antiviruspoint.org to the Hostinger IP so it works before DNS moves.
"""
import re
import ssl
import http.client

HOST = 'antiviruspoint.org'
IP = '77.37.90.129'
PAGE = '/Users/loken/.claude/jobs/29438203/tmp/F.html'

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def check(url):
    path = url.split(HOST, 1)[-1] if HOST in url else url
    conn = http.client.HTTPSConnection(IP, 443, context=ctx, timeout=25)
    try:
        conn.request('GET', path, headers={'Host': HOST, 'User-Agent': 'Mozilla/5.0'})
        r = conn.getresponse()
        body = r.read()
        return r.status, len(body)
    except Exception as exc:
        return 'ERR', str(exc)
    finally:
        conn.close()


html = open(PAGE, encoding='utf-8', errors='replace').read()

# header logo区, footer区, favicons
sections = {}
hi = html.find('hw-nav-logo')
if hi > 0:
    sections['HEADER'] = html[hi:hi + 4000]
fi = html.find('hw-footer')
if fi > 0:
    sections['FOOTER'] = html[fi:fi + 9000]

seen = set()
for name, chunk in sections.items():
    print('=== %s ===' % name)
    urls = re.findall(r'(?:data-src|src)=["\'](https://antiviruspoint\.org/wp-content/uploads/[^"\']+)', chunk)
    for u in urls:
        if u in seen:
            continue
        seen.add(u)
        code, size = check(u)
        flag = '' if code == 200 else '   <-- BROKEN'
        print('  %-5s %-9s %s%s' % (code, size, u.split('/uploads/')[-1][:62], flag))
    if not urls:
        print('  (no uploads images found)')
    print()

print('=== FAVICON / SITE ICON ===')
for m in re.findall(r'<link[^>]+rel=["\'](?:icon|shortcut icon|apple-touch-icon)["\'][^>]*>', html):
    h = re.search(r'href=["\']([^"\']+)', m)
    if not h:
        continue
    u = h.group(1)
    code, size = check(u)
    flag = '' if code == 200 else '   <-- BROKEN'
    print('  %-5s %-9s %s%s' % (code, size, u.split('/uploads/')[-1][:62], flag))
