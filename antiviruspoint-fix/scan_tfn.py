"""Find every place the wrong toll-free number appears on the wpcomstaging site.

Correct number (confirmed by the site owner): +1-855-535-7753
Wrong number currently on wpcomstaging:       +1-877-593-4465
"""
import re
import urllib.request

STAGING = 'https://antiviruspointorgdomainonly.wpcomstaging.com'
UA = {'User-Agent': 'Mozilla/5.0 Chrome/120'}

PAGES = [
    '/',
    '/shop/',
    '/shop/sing-register/',
    '/about-us/',
    '/contact-us/',
    '/faqs/',
    '/cart/',
    '/checkout/',
]

WRONG_DIGITS = '8775934465'
RIGHT_DIGITS = '8555357753'


def fetch(path):
    url = STAGING + path
    req = urllib.request.Request(url, headers=UA)
    try:
        r = urllib.request.urlopen(req, timeout=40)
        return r.getcode(), r.read().decode('utf-8', 'replace')
    except Exception as exc:
        return getattr(exc, 'code', 'ERR'), ''


for path in PAGES:
    code, html = fetch(path)
    if not html:
        print('%-24s HTTP %s' % (path, code))
        continue

    # normalise digit-only form so any separator style is caught
    digits_only = re.sub(r'[^0-9]', '', html)
    wrong_norm = digits_only.count(WRONG_DIGITS)
    right_norm = digits_only.count(RIGHT_DIGITS)

    wrong_raw = len(re.findall(r'8[\s\-\.\(\)]*7[\s\-\.\(\)]*7[\s\-\.\(\)]*5?9?3?', html)) and None
    tel_links = sorted(set(re.findall(r'tel:([+0-9\-\s\(\)]+)', html)))
    visible = sorted(set(re.findall(r'\+?1?[\s\-]?\(?8\d{2}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}', html)))

    print('%-24s HTTP %-4s | wrong:%d right:%d | tel:%s | shown:%s'
          % (path, code, wrong_norm, right_norm, tel_links, visible))
