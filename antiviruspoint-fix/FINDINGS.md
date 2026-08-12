# antiviruspoint.org — findings, 2026-08-12

## STATUS: COMPLETE — live on Hostinger, DNS switched, SSL valid

The `@` A record was changed from WordPress.com (`192.0.78.213`, `192.0.78.173`)
to Hostinger (`77.37.90.129`) via the Hostinger DNS API, using `overwrite: true`
scoped to the `@`/`A` pair only, so MX, SPF, DKIM, DMARC and the `www` CNAME were
left untouched and email was never at risk. Validated before applying, and
Hostinger keeps zone snapshots for rollback.

Verified over real public DNS afterwards:

| Check | Result |
|---|---|
| `antiviruspoint.org` | HTTPS 200 from `77.37.90.129`, **SSL verifies cleanly** |
| `www.antiviruspoint.org` | HTTPS 200, SSL valid |
| Propagation | authoritative NS and 8.8.8.8 both return `77.37.90.129` |
| Old toll-free number | 0 |
| New number, gtag, footer logo, favicon | all present |
| Product cards | 60, one price + one image each |
| Broken assets | 0 |

Remaining cleanup, not blocking: the leftover `fmt` A record still points at
`192.0.78.213` (a WordPress.com artifact), and the WordPress.com Premium and
Jetpack Boost subscriptions can be cancelled once a live test order has passed.

## Earlier status: migrated to Hostinger and verified (DNS not yet switched)

The correct-content site is now running on Hostinger and confirmed working by
resolving `antiviruspoint.org` straight to the Hostinger IP, so nothing depended
on DNS:

| Check | Result |
|---|---|
| Homepage | HTTP 200, freshly rendered |
| Product cards | 60 cards, **1 price + 1 image each**, no duplicates |
| Old toll-free number | **0 occurrences** anywhere |
| New number `+1-855-535-7753` | present (display + `tel:`) |
| Purple demo-store bar | gone |
| Google Ads `AW-17518714922` | present |
| Staging-domain references | 0 |
| Data | 57 published products · 26 pages · 42 orders |

**DNS still points at WordPress.com** (`192.0.78.173` / `192.0.78.213`). The
A-record cutover is the one remaining step and was deliberately not performed.

Rollback if ever needed: the placeholder site is preserved as
`wp-content-placeholder` plus `~/placeholder-db-backup.sql`, and the original
`wp-config.php` as `~/wp-config.php.bak`.



## The root problem: the paid plan and the domain are on different sites

| | `antiviruspoint.org` | `antiviruspointorgdomainonly.wpcomstaging.com` |
|---|---|---|
| Blog ID | **248244777** | **245503557** |
| Created | 2025-09-10 | 2025-06-13 (older = original) |
| WordPress.com label | **"Staging"** | "Incoming Migration — Migration started" |
| Paid plan | none — only a **Domain Connection** (₹0, renews 2030) | **Premium** (exp. 2027-07-17) + Jetpack Search + **Jetpack Boost (expires in 23 days)** |
| MCP access | available | **disabled** (`site_level_disabled`) |
| Renders correctly | ❌ | ✅ |
| Who sees it | **all customers** | nobody |

So customers are being served a **drifted staging copy**, while the money is
spent on a site nobody visits. Everything below follows from that: the staging
copy had ShopEngine, Easy Digital Downloads and the Performance Lab suite piled
onto it, which is what produced the duplicate cards, the wrong footer and the
9–10 s uncached page loads.

Confirmed drift (live vs. the correct site):

| | live `.org` | correct site |
|---|---|---|
| ShopEngine references | **29** | **0** |
| `data-od-xpath` (Optimization Detective) | **346** | **0** |
| Page size / load | 907–973 KB / 9–10 s | 585 KB / 0.8 s |

## Toll-free number

**Correct number, confirmed by the owner: `+1-855-535-7753`.**

Live `.org` already has it. The correct-content site has the **wrong** number on
every page, and malformed (`+1-8775934465`, missing dashes):

| Page | wrong `+1-877-593-4465` | correct number |
|---|---|---|
| `/`, `/shop/`, `/shop/sing-register/`, `/about-us/`, `/faqs/`, `/cart/`, `/checkout/` | 3× each | 0 |
| `/contact-us/` | 5× | 0 |

Identical counts site-wide ⇒ it is rendered from stored settings, not per page.

### Exactly where it lives (from the 2026-08-11 Jetpack backup, prefix `fqsi_`)

`find_tfn_db.py` locates it; `fix_tfn_sql.py` replaces it. **31 occurrences**:

| Table | Hits | Location |
|---|---|---|
| `fqsi_options` | 1 | option **`cnb`** (Call Now Button) — **serialized PHP**, `s:6:"number";s:12:"+18775934465"` |
| `fqsi_postmeta` | 10 | Visual Header **`call_textarea`** (stored URL-encoded *and* double-URL-encoded), an Elementor icon-box, an Elementor list item, a "US Support" pill |
| `fqsi_posts` | 20 | `contact-us`, `return-policy`, the terms page, page `300553`, plus revisions |

Also present in the `cnb` option: a **third number `+1-954-336-4969`**, which may
or may not be wanted.

### Why the replacement is digits-only

`fix_tfn_sql.py` swaps only the 10 digits `8775934465` → `8555357753`. That is
byte-for-byte length preserving, which matters because the `cnb` value is
serialized PHP with a length prefix: rewriting it to the formatted
`+1-855-535-7753` would make a 12-byte string 15 bytes and silently corrupt the
option — the classic way search-and-replace white-screens a WordPress site.

Verified on the extracted dump: 31 replacements, byte length unchanged in all
three tables, zero residual wrong digits, and the serialized option still
validates (`declared len=12 actual len=12 value=+18555357753 → OK`).

Consequence: the stored value becomes `+1-8555357753`. Adding the display dashes
(`+1-855-535-7753`) changes string length and so must be done through the
WordPress UI on the few visible spots — note the site's number is *already*
malformed today (`+1-8775934465`), so formatting is pre-existing, not new.

### Blocked from changing it live

The browser session on `antiviruspointorgdomainonly.wpcomstaging.com` is signed
in as a **customer-level user ("Lokendra")** — `/wp-admin/` redirects to
My Account and `edit.php?post_type=visualheader` returns "Sorry, you are not
allowed to access this page." WordPress.com SSO does not override an existing
local WP session, and MCP access is disabled for this site, so the change needs
either an admin login or the migration path below.

Not phone numbers, despite matching a phone-shaped regex: `-8034482512`,
`-8613342216`, `-8808679026`, `-8854671477`, `18604651163`. These are the
theme's random `hw-nav-<digits>` element IDs.

## Fixes applied and verified live

1. **Purple bar removed.** It was WooCommerce's *demo-store* Store Notice. The
   Customizer checkbox was already off, so what visitors saw came from **stale
   cache**. Purged LiteSpeed; verified on a fresh fetch — zero notice elements,
   no `woocommerce-demo-store` body class.

2. **Google Ads tag installed** (`AW-17518714922`). Activated WPCode Lite (was
   installed but inactive) and added the snippet to the Header field. The
   existing **LinkedIn Insight Tag** in the footer field was left untouched
   (756 bytes, unchanged). Verified live; LiteSpeed base64-minifies inline JS, so
   it had to be decoded to confirm:
   `gtag('js',new Date());gtag('config','AW-17518714922')`

3. **Duplicate product-card image and price removed.** Appended to Customizer →
   Additional CSS, preserving all 1355 original characters. Verified present in
   the LiteSpeed combined stylesheet:
   ```css
   .hw-post-product .hw-details>img{display:none!important}
   .hw-post-product .hw-details>span.price{display:none!important}
   ```

### Why CSS instead of the PHP plugin in this directory

The PHP plugin here is the cleaner fix — it stops the duplicate markup being
generated at all, rather than hiding it. It could not be installed because:

- `wpcom-mcp` `plugin.install` accepts **only WordPress.org slugs**, not a custom zip.
- WPCode Lite on this site exposes **only** the Header/Footer page — no snippet
  manager — so it cannot run PHP.

Keep the plugin for the Hostinger migration, where a zip can simply be uploaded.

The duplicate came from the Filson theme rendering its own card markup
(`.hw-thumb` / `.hw-price`) **and** firing WooCommerce's default loop hooks
inside `.hw-details`, so WooCommerce printed a second thumbnail and price. The
`<span class="price">` wrapper is the signature of WooCommerce's `loop/price.php`,
which proves the second copy is core, not the theme. Measured before the fix:
2 prices on 60/60 homepage cards and 15/15 cards on `/shop/` and every category.

## Footer — both sites have one; the content differs

An earlier note in this file claimed live's footer was empty. **That was wrong** —
it came from reading the `<footer>` element near the end of the document, which
holds only scripts. The real footer is in `hw-footer` containers.

| Element | Correct site | Live |
|---|---|---|
| Product tags block (17 tags) | ✅ | ❌ |
| Trust & Verification page | ✅ | ❌ |
| Communication preferences | ✅ | ❌ |
| **Cookie consent banner + preferences manager** | ✅ (6 refs) | ❌ (1 ref) |
| Toll-free + email contact block | ❌ | ✅ |
| Footer Categories | ❌ | ✅ (typo: **"Sofware"**) |
| Copyright year | © 2024 (stale) | © 2026 (correct) |

Copying the correct site's footer wholesale would **regress the copyright to
2024** and **delete the contact block**. Live is missing the **cookie consent
banner**, which is a privacy-compliance gap worth closing regardless.

## Backups

There are **no Jetpack backups**. The Jetpack VaultPress Backup plugin is
installed but **inactive**, and billing shows *"Jetpack VaultPress Backup Plan —
Activate your product license key"* — the plan is paid for but was never
activated.

What exists locally instead:

- **524 MB** `antiviruspoint-com-20250218-…wpress` (All-in-One WP Migration;
  note **.com**, not .org) in `~/.agents-cli/backups/…/local-path-provisioner/`
- **3.5 MB** `~/Downloads/antiviruspointorg.WordPress.2026-08-02.xml` — content
  only; the file's own header states it is *not* a complete backup

Hostinger already has **daily backups** enabled.

## Plugin load

**99 plugins, 64 active.** Conflicts that matter:

- **3 active caches**: LiteSpeed Cache + Jetpack Boost + Page Optimize
- **2 active SSL plugins**: SSL Zen + WP Encryption
- **WooCommerce 11.0.1 *and* Easy Digital Downloads 3.6.9.1** both active
- 2 reCAPTCHA plugins, 2 migration plugins (All-in-One WP Migration + Migrate Guru)
- **GTM4WP** and **Site Kit** both active but emitting no tag before this work

## Corrected earlier claim

An automated page summary reported "all 18 brand logos fail to load". **False.**
Every logo (`1-2.png` … `17-2.webp`) returns `HTTP 200` with real image bytes;
they are Elementor `swiper-lazy` images and the summarizer mistook lazy-load
placeholders for broken ones.

## Migration to Hostinger hPanel

Current Hostinger state: `antiviruspoint.org` exists (created 2026-07-24) but is
a **blank WordPress 7.0.3 running "Hostinger AI theme 2.1.0"** — not the store —
and hPanel warns *"Domain isn't connected to your website."*

DNS is already on Hostinger nameservers (`ns1/ns2.dns-parking.com`) while the A
records point at WordPress.com (`192.0.78.173`, `192.0.78.213`). Cutover is
therefore a single A-record change already under the owner's control — no
registrar transfer needed.

Order:

1. Take a fresh full backup, or activate the **VaultPress licence already paid for**.
2. Migrate with **Migrate Guru** (already active). Prefer it over All-in-One WP
   Migration: the free AIO import cap is ~512 MB and the last archive was
   **524 MB**, so AIO would fail.
3. Migrate the **correct-content site**, then set the TFN to `+1-855-535-7753`.
4. Test on Hostinger's temporary URL **before** touching DNS.
5. Flip the A record — the only irreversible, customer-visible step.
6. Re-issue SSL; test checkout end to end (Stripe + PayPal); re-verify the
   `AW-17518714922` and LinkedIn tags.
7. Only once verified, cancel WordPress.com Premium and Jetpack Boost.

**Licence risk:** Elementor Pro, ShopEngine, WooCommerce Subscriptions /
Bundles / Product Add-Ons, AutomateWoo and YITH were provisioned through the
WordPress.com plan. On Hostinger they need their own licences or they stop
receiving updates. Decide whether the store is **WooCommerce or EDD** before
migrating — carrying both doubles the work.

## Blocked

Changing the TFN on the correct-content site needs one of:

- MCP access enabled for site **245503557** (currently `site_level_disabled`), or
- a browser session against its WP Admin.
