# antiviruspoint.org — diagnosis, 2026-08-12

## Environment (measured, not assumed)

| Fact | Value |
|---|---|
| Host | **WordPress.com** (Automattic) — `192.0.78.173`, `host-header: WordPress.com`, `a8c-cdn` |
| DNS | Hostinger `ns1/ns2.dns-parking.com` (parking only — does **not** host the site) |
| Theme | `filson` (child/custom, `hw-*` class prefix) |
| Stack | WooCommerce + Elementor + Easy Digital Downloads 3.6.9.1 + Jetpack Site Kit |

Note: the Hostinger MCP credentials in this environment return `Unauthenticated` and are
irrelevant to this site — it is not a Hostinger property.

## Confirmed bug: every product card renders its image and price twice

One root cause produces both symptoms. The Filson theme builds its own card markup
(`.hw-thumb`, `.hw-price`) **and** fires WooCommerce's default loop hooks inside that same
card without unhooking the core callbacks. So WooCommerce prints a second copy of each.

The price, straight from the live HTML:

```html
<div class="hw-price">99.99$ 24.95$</div>                              <!-- theme -->
<span class="price"><div class="hw-price">99.99$ 24.95$</div></span>   <!-- woocommerce_template_loop_price -->
```

The `<span class="price">` wrapper is the signature of WooCommerce's `loop/price.php`,
which proves the second copy is the core hook rather than the theme.

The duplicate `<img>` sits inside `.hw-details` directly after the `<span class="onsale">`
badge — exactly the output order of `woocommerce_before_shop_loop_item_title`, where the
sale flash and the thumbnail are both attached at priority 10, flash first.

### Measured scope (noscript fallbacks excluded, so these are *visible* elements)

| Page | Cards | `hw-price` per card | Visible `<img>` per card |
|---|---|---|---|
| `/` (homepage) | 60 | **2** on 60/60 | **2** on 59/60 |
| `/shop/` | 15 | **2** on 15/15 | **2** on 15/15 |
| `/product-category/androids/` | 15 | **2** on 15/15 | **2** on 15/15 |

100% of product cards are affected, site-wide.

## The fix

`antiviruspoint-fix-duplicate-card-output.php` removes the two core callbacks:

```php
remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
remove_action( 'woocommerce_after_shop_loop_item_title',  'woocommerce_template_loop_price',             10 );
```

Why this is safe:

- **Cannot affect product detail pages.** Both hooks are loop-only; single products use
  `woocommerce_before_single_product_summary` / `woocommerce_single_product_summary`.
- **Cannot blank a card.** The theme's own markup is emitted *first* in every card, so
  removing the core duplicate leaves the intended design intact.
- **Fixes related/up-sell/cross-sell blocks too**, since they reuse `content-product.php`.
- **Reversible** — deactivate the plugin and the old behaviour returns.
- The `onsale` badge is deliberately left attached; it renders once and is intended.

Preferred as a plugin rather than a theme edit so it survives theme updates.

### Not yet verified
The fix is lint-clean (`php -l`) and the hook names are WooCommerce core API, but it has
**not been executed against a running WordPress instance** — there is no local WP install
and no authenticated access to the live site. It needs one load of `/shop/` after
activation to confirm one image and one price per card.

## Corrected earlier claim

An automated page summary reported "all 18 brand logos fail to load". **That is false.**
Every logo (`1-2.png` … `17-2.webp`) returns `HTTP 200` with real image bytes. They are
Elementor `swiper-lazy` images, so the summarizer mistook lazy-load placeholders for
broken images. No action needed.

## Separate, unfixed: the homepage is very heavy

Not a bug, but the biggest remaining user-visible problem:

- **907 KB of HTML** for the homepage alone (before CSS/JS/images)
- **6.7 s** wall-clock fetch; `server-timing: wp-before-template;dur=2132ms`, cache `MISS;dur=6001ms`
- Driven by **60 product cards in 8 near-identical carousels** (Popularity, Special Sale,
  All Products, Deals of the Week, Trending, Featured, Most Purchased, plus per-platform
  rows) that largely repeat the same products.

Removing the duplicate markup will shave some weight, but the real win is cutting the
number of redundant carousels. That is a design decision, so it is left alone here.
