<?php
/**
 * Plugin Name: AntivirusPoint – Google Ads Tag
 * Description: Prints the Google Ads gtag.js tag (AW-17518714922) in <head>. Installed as a must-use plugin so it survives theme changes and plugin updates.
 * Version:     1.0.0
 * Author:      MarketingTool
 * License:     GPL-2.0-or-later
 */

defined( 'ABSPATH' ) || exit;

const AVP_GOOGLE_ADS_ID = 'AW-17518714922';

/**
 * Print the Google Ads gtag.js snippet in <head>.
 *
 * Printed directly rather than enqueued because gtag.js is expected early in
 * <head>, and because script optimisation on this host defers enqueued scripts,
 * which would delay the initial page_view.
 *
 * The `avp_gtag_installed` filter lets Site Kit (or any other plugin) take over
 * later without producing a duplicate tag:
 *     add_filter( 'avp_gtag_installed', '__return_true' );
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
