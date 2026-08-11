<?php
/**
 * Plugin Name:       AntivirusPoint – Fix Duplicate Product Card Output
 * Plugin URI:        https://antiviruspoint.org/
 * Description:       Stops every WooCommerce product card from rendering its thumbnail and price twice. The Filson theme builds its own card markup and also fires WooCommerce's default loop hooks inside it, so WooCommerce printed a second image and a second price into all 60 cards on the homepage and all 15 on every shop/category page.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            MarketingTool
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || exit;

/**
 * Remove WooCommerce's default product-loop thumbnail and price output.
 *
 * Diagnosis (observed in the rendered HTML of antiviruspoint.org):
 *
 * The Filson theme renders its own card markup — `.hw-thumb` for the image and
 * `.hw-price` for the price — and then calls do_action() for WooCommerce's
 * standard loop hooks inside that same card. WooCommerce's core callbacks are
 * still attached, so each card received a second copy of both elements:
 *
 *     <div class="hw-price">99.99$ 24.95$</div>                        <- theme's own output
 *     <span class="price"><div class="hw-price">99.99$ 24.95$</div></span>  <- woocommerce_template_loop_price
 *
 * The `<span class="price">` wrapper is the signature of WooCommerce's
 * loop/price.php template, which confirms the second copy is the core hook and
 * not the theme. The same applies to the thumbnail: the duplicate <img> appears
 * inside `.hw-details` immediately after the `<span class="onsale">` badge,
 * which is exactly the output order of `woocommerce_before_shop_loop_item_title`
 * (sale flash and thumbnail are both attached at priority 10, flash first).
 *
 * Why this is safe:
 *
 * - Both hooks are loop-only. Single product pages build their image and price
 *   from `woocommerce_before_single_product_summary` and
 *   `woocommerce_single_product_summary`, which are untouched here, so product
 *   detail pages cannot be affected.
 * - The theme's own markup is emitted first in every card, so removing the core
 *   callbacks leaves the intended design intact rather than blanking the card.
 * - Related products, up-sells and cross-sells reuse the same
 *   content-product.php loop, so they are corrected consistently.
 * - The `onsale` badge is deliberately left attached; it renders only once and
 *   is part of the intended design.
 *
 * Hooked on `init` at priority 99 so it runs after WooCommerce registers its
 * template hooks and after the theme has had a chance to add its own.
 *
 * @return void
 */
function avp_remove_duplicate_loop_card_output() {
	remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
	remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
}
add_action( 'init', 'avp_remove_duplicate_loop_card_output', 99 );
