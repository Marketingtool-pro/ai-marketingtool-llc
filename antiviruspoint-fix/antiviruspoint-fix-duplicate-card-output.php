<?php
/**
 * Plugin Name:       AntivirusPoint – Site Fixes
 * Plugin URI:        https://antiviruspoint.org/
 * Description:       Three fixes for antiviruspoint.org: (1) stops every WooCommerce product card rendering its thumbnail and price twice, (2) installs the Google Ads tag AW-17518714922, (3) turns off the "demo store" purple notice bar on activation.
 * Version:           1.1.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            MarketingTool
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || exit;

/**
 * The Google Ads / gtag.js measurement ID installed by this plugin.
 */
const AVP_GOOGLE_ADS_ID = 'AW-17518714922';

/* -------------------------------------------------------------------------
 * Fix 1 — duplicate thumbnail and price in every product card
 * ---------------------------------------------------------------------- */

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
 *     <div class="hw-price">99.99$ 24.95$</div>                             <- theme's own output
 *     <span class="price"><div class="hw-price">99.99$ 24.95$</div></span>  <- woocommerce_template_loop_price
 *
 * The `<span class="price">` wrapper is the signature of WooCommerce's
 * loop/price.php template, which confirms the second copy is the core hook and
 * not the theme. The same applies to the thumbnail: the duplicate <img> appears
 * inside `.hw-details` immediately after the `<span class="onsale">` badge,
 * which is exactly the output order of `woocommerce_before_shop_loop_item_title`
 * (sale flash and thumbnail are both attached at priority 10, flash first).
 *
 * Measured scope before the fix: 2 prices on 60/60 homepage cards, and on 15/15
 * cards of both /shop/ and /product-category/androids/. The
 * antiviruspointorgdomainonly.wpcomstaging.com copy of this site, on the same
 * theme, renders 1 price and 1 image per card — this restores that output.
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

/* -------------------------------------------------------------------------
 * Fix 2 — Google Ads tag (gtag.js)
 * ---------------------------------------------------------------------- */

/**
 * Print the Google Ads gtag.js snippet in <head>.
 *
 * The site had no Google tracking of any kind before this: no gtag.js, no
 * GTM- container and no G- measurement ID appeared anywhere in the rendered
 * HTML, despite Site Kit being installed.
 *
 * Printed directly rather than enqueued because gtag.js is expected early in
 * <head>, and because LiteSpeed/Jetpack script optimisation on this host defers
 * enqueued scripts, which would delay the initial page_view.
 *
 * The `avp_gtag_installed` guard means that if Site Kit (or any other plugin)
 * is later configured to emit the same ID, this can be short-circuited with
 * `add_filter( 'avp_gtag_installed', '__return_true' )` instead of producing a
 * duplicate tag.
 *
 * @return void
 */
function avp_print_google_ads_tag() {
	if ( apply_filters( 'avp_gtag_installed', false ) ) {
		return;
	}

	$id = AVP_GOOGLE_ADS_ID;
	?>
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo rawurlencode( $id ); ?>"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());

	  gtag('config', <?php echo wp_json_encode( $id ); ?>);
	</script>
	<?php
}
add_action( 'wp_head', 'avp_print_google_ads_tag', 1 );

/* -------------------------------------------------------------------------
 * Fix 3 — the purple "demo store" notice bar
 * ---------------------------------------------------------------------- */

/**
 * Turn off WooCommerce's store notice on activation.
 *
 * The purple bar reading "Antiviruspoint.org  Dismiss" that visitors saw was
 * WooCommerce's demo-store notice:
 *
 *     <body class="… woocommerce-demo-store …">
 *     <p class="woocommerce-store-notice demo_store" …>Antiviruspoint.org <a …>Dismiss</a></p>
 *
 * It is driven by the `woocommerce_demo_store` option (Customizer → WooCommerce
 * → Store Notice). Flipping the option off — rather than filtering the markup
 * away — also drops the `woocommerce-demo-store` body class, which is what
 * actually tells WooCommerce this is a demo store rather than a real one.
 *
 * Done once on activation so it stays a normal, reversible WooCommerce setting:
 * deactivating this plugin will not silently turn the notice back on, and an
 * admin can re-enable it in the Customizer at any time.
 *
 * The notice text itself is left in place, so re-enabling restores it unchanged.
 *
 * @return void
 */
function avp_disable_demo_store_notice() {
	if ( 'no' !== get_option( 'woocommerce_demo_store' ) ) {
		update_option( 'woocommerce_demo_store', 'no' );
	}
}
register_activation_hook( __FILE__, 'avp_disable_demo_store_notice' );
