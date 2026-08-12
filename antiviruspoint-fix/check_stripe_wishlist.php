<?php
/**
 * Diagnose the Stripe gateway and the YITH wishlist after migration.
 *
 * Reports only configuration state and whether credentials are non-empty -
 * never the credential values themselves.
 *
 * Run with:  wp eval-file check_stripe_wishlist.php
 */

echo "=== STRIPE ===\n";

$s = get_option( 'woocommerce_stripe_settings' );
if ( ! is_array( $s ) ) {
	echo "  woocommerce_stripe_settings missing\n";
} else {
	printf( "  enabled            : %s\n", $s['enabled'] ?? '(unset)' );
	printf( "  testmode           : %s\n", $s['testmode'] ?? '(unset)' );
	printf( "  keys stored in settings:\n" );
	$found_key = false;
	foreach ( $s as $k => $v ) {
		if ( ! preg_match( '/(key|secret|token|client)/i', $k ) ) {
			continue;
		}
		$val = is_string( $v ) ? trim( $v ) : '';
		printf( "    %-30s %s\n", $k, $val !== '' ? 'SET (' . strlen( $val ) . ')' : 'EMPTY' );
		if ( $val !== '' ) {
			$found_key = true;
		}
	}
	printf( "  any credential set : %s\n", $found_key ? 'YES' : 'NO' );
}

// Newer versions store the Stripe Connect account separately.
foreach ( array( 'woocommerce_stripe_account_settings', 'wc_stripe_account_data_live', 'wc_stripe_account_data_test' ) as $opt ) {
	$v = get_option( $opt );
	printf( "  %-36s %s\n", $opt, $v ? 'PRESENT' : 'absent' );
}

printf( "  plugin active      : %s\n", is_plugin_active( 'woocommerce-gateway-stripe/woocommerce-gateway-stripe.php' ) ? 'yes' : 'no' );

echo "\n=== WISHLIST (YITH) ===\n";

printf( "  plugin active      : %s\n", is_plugin_active( 'yith-woocommerce-wishlist/init.php' ) ? 'yes' : 'no' );

$page_id = get_option( 'yith_wcwl_wishlist_page_id' );
printf( "  wishlist page id   : %s\n", $page_id ?: '(unset)' );

if ( $page_id ) {
	$p = get_post( $page_id );
	if ( ! $p ) {
		echo "  PAGE MISSING - the id points at a post that no longer exists\n";
	} else {
		printf( "  page status        : %s\n", $p->post_status );
		printf( "  page title         : %s\n", $p->post_title );
		printf( "  page url           : %s\n", get_permalink( $p ) );
		printf( "  contains shortcode : %s\n", ( strpos( $p->post_content, 'yith_wcwl_wishlist' ) !== false ) ? 'yes' : 'NO' );
	}
}

global $wpdb;
$tbl = $wpdb->prefix . 'yith_wcwl';
$exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $tbl ) );
printf( "  table %-14s %s\n", $tbl, $exists ? 'exists' : 'MISSING' );
if ( $exists ) {
	printf( "  wishlist rows      : %s\n", $wpdb->get_var( "SELECT COUNT(*) FROM {$tbl}" ) );
}
