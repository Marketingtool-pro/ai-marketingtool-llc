"""Check whether the duplicate-product-card CSS fix reached the live stylesheet.

LiteSpeed combines all CSS into external files, so the rules will not appear in
the page HTML — they have to be looked for inside the combined stylesheets.
"""
import re
import urllib.request

BASE = '/Users/loken/.claude/jobs/29438203/tmp/'
UA = {'User-Agent': 'Mozilla/5.0 Chrome/120'}


def fetch(url):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers=UA), timeout=30
    ).read().decode('utf-8', 'replace')


html = open(BASE + 'k.html', encoding='utf-8', errors='replace').read()
urls = sorted(set(re.findall(
    r'https://antiviruspoint\.org/wp-content/litespeed/css/[a-z0-9]+\.css\?ver=[a-z0-9]+',
    html)))
print('combined css files referenced:', len(urls))

total = 0
hits = []
for u in urls:
    try:
        css = fetch(u)
    except Exception as exc:
        print('  FAILED', u.split('/')[-1][:18], exc)
        continue
    total += len(css)
    for rule in re.findall(r'[^{}]*hw-details[^{]*\{[^}]*\}', css):
        if 'span.price' in rule or re.search(r'>\s*img', rule):
            hits.append(rule.strip()[:200])

print('total css bytes fetched:', total)
print('matching hw-details rules:', len(hits))
for h in hits[:8]:
    print('   ', h)

# also check the raw saved Additional CSS via the front-end inline block
inline = re.findall(r'<style[^>]*id=["\']wp-custom-css["\'][^>]*>(.*?)</style>', html, re.S)
print('inline wp-custom-css blocks in HTML:', len(inline))
if inline:
    blob = inline[0]
    print('  inline length:', len(blob))
    print('  contains span.price rule:', 'span.price' in blob)
