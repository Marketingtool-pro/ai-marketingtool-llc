<?php
/**
 * Report the state of the WooCommerce payment gateways after migration.
 *
 * Prints only whether each gateway is enabled, whether it is in test/sandbox
 * mode, and whether its credentials are non-empty. Never prints the credentials
 * themselves.
 *
 * Run with:  wp eval-file check_gateways.php
 */

if ( ! function_exists( 'WC' ) ) {
	echo "WooCommerce not loaded\n";
	return;
}

$gateways = WC()->payment_gateways() ? WC()->payment_gateways()->payment_gateways() : array();

echo "=== ENABLED GATEWAYS ===\n";
$any = false;
foreach ( $gateways as $id => $gw ) {
	if ( 'yes' !== $gw->enabled ) {
		continue;
	}
	$any = true;
	printf( "  %-28s %s\n", $id, $gw->get_title() );
}
if ( ! $any ) {
	echo "  (none enabled)\n";
}

/**
 * Summarise one settings option without revealing secrets.
 *
 * @param string $label  Human label.
 * @param string $option Option name.
 * @param array  $flags  Keys treated as mode switches.
 * @param array  $creds  Keys treated as credentials.
 */
function avp_report( $label, $option, $flags, $creds ) {
	$s = get_option( $option );
	if ( ! is_array( $s ) || ! $s ) {
		return;
	}
	echo "\n=== {$label} ({$option}) ===\n";
	printf( "  enabled            : %s\n", $s['enabled'] ?? '(unset)' );
	foreach ( $flags as $f ) {
		if ( array_key_exists( $f, $s ) ) {
			printf( "  %-18s : %s\n", $f, is_scalar( $s[ $f ] ) ? $s[ $f ] : gettype( $s[ $f ] ) );
		}
	}
	foreach ( $creds as $c ) {
		if ( array_key_exists( $c, $s ) ) {
			$v = is_string( $s[ $c ] ) ? trim( $s[ $c ] ) : '';
			printf( "  %-18s : %s\n", $c, $v !== '' ? 'SET (' . strlen( $v ) . ' chars)' : 'EMPTY' );
		}
	}
}

avp_report(
	'Stripe',
	'woocommerce_stripe_settings',
	array( 'testmode' ),
	array( 'publishable_key', 'secret_key', 'test_publishable_key', 'test_secret_key', 'webhook_secret' )
);

avp_report(
	'PayPal (legacy)',
	'woocommerce_paypal_settings',
	array( 'testmode' ),
	array( 'api_username', 'api_password', 'api_signature' )
);

// PayPal Payments (ppcp) stores most config in standalone options.
echo "\n=== PayPal Payments (ppcp) ===\n";
$ppcp_gw = get_option( 'woocommerce_ppcp-gateway_settings' );
printf( "  gateway enabled    : %s\n", is_array( $ppcp_gw ) ? ( $ppcp_gw['enabled'] ?? '(unset)' ) : '(no settings)' );
foreach ( array( 'woocommerce-ppcp-settings', 'woocommerce_ppcp-credit-card-gateway_settings' ) as $opt ) {
	$v = get_option( $opt );
	if ( is_array( $v ) ) {
		$sandbox = $v['sandbox_on'] ?? $v['testmode'] ?? '(unset)';
		printf( "  %-34s sandbox_on=%s\n", $opt, is_scalar( $sandbox ) ? var_export( $sandbox, true ) : 'n/a' );
		foreach ( array( 'client_id', 'client_secret', 'merchant_id', 'merchant_email' ) as $k ) {
			if ( array_key_exists( $k, $v ) ) {
				$val = is_string( $v[ $k ] ) ? trim( $v[ $k ] ) : '';
				printf( "     %-16s: %s\n", $k, $val !== '' ? 'SET' : 'EMPTY' );
			}
		}
	}
}

echo "\n=== STORE ===\n";
printf( "  currency           : %s\n", get_option( 'woocommerce_currency' ) );
printf( "  store country      : %s\n", get_option( 'woocommerce_default_country' ) );
printf( "  site url           : %s\n", get_option( 'siteurl' ) );
