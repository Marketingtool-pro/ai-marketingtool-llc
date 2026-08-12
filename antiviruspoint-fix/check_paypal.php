<?php
/**
 * Diagnose the PayPal Payments (ppcp) gateway.
 *
 * A PayPal button can render on the cart even when the merchant credentials are
 * missing, then fail the moment it is clicked - so the button being visible is
 * not proof the gateway works. This reports whether onboarding actually
 * completed and whether credentials are present.
 *
 * Reports only presence and lengths, never credential values.
 *
 * Run with:  wp eval-file check_paypal.php
 */

echo "=== ppcp plugin ===\n";
printf( "  active : %s\n", is_plugin_active( 'woocommerce-paypal-payments/woocommerce-paypal-payments.php' ) ? 'yes' : 'no' );

echo "\n=== ppcp settings option ===\n";
$s = get_option( 'woocommerce-ppcp-settings' );
if ( ! is_array( $s ) ) {
	echo "  woocommerce-ppcp-settings MISSING or not an array\n";
} else {
	printf( "  keys stored: %d\n", count( $s ) );
	$interesting = array(
		'enabled', 'sandbox_on', 'merchant_email', 'merchant_id',
		'client_id', 'client_secret',
		'merchant_email_production', 'merchant_id_production',
		'client_id_production', 'client_secret_production',
		'merchant_email_sandbox', 'merchant_id_sandbox',
		'client_id_sandbox', 'client_secret_sandbox',
		'intent', 'vault_enabled', 'button_enabled', 'products_dcc_enabled',
	);
	foreach ( $interesting as $k ) {
		if ( ! array_key_exists( $k, $s ) ) {
			continue;
		}
		$v = $s[ $k ];
		if ( is_bool( $v ) ) {
			$show = $v ? 'true' : 'false';
		} elseif ( is_string( $v ) ) {
			$t = trim( $v );
			// Mask anything that looks like a secret.
			$show = preg_match( '/(secret|client_id)/i', $k )
				? ( $t !== '' ? 'SET (' . strlen( $t ) . ' chars)' : 'EMPTY' )
				: ( $t !== '' ? $t : 'EMPTY' );
		} else {
			$show = gettype( $v );
		}
		printf( "  %-28s %s\n", $k, $show );
	}
}

echo "\n=== gateway registration ===\n";
if ( function_exists( 'WC' ) && WC()->payment_gateways() ) {
	foreach ( WC()->payment_gateways()->payment_gateways() as $id => $gw ) {
		printf( "  %-30s enabled=%-4s available=%s\n",
			$id,
			$gw->enabled,
			method_exists( $gw, 'is_available' ) ? ( $gw->is_available() ? 'YES' : 'no' ) : '?'
		);
	}
}

echo "\n=== onboarding / status flags ===\n";
foreach ( array(
	'woocommerce-ppcp-is-onboarded',
	'woocommerce_ppcp-gateway_settings',
	'woocommerce-ppcp-onboarding-state',
) as $opt ) {
	$v = get_option( $opt );
	if ( is_array( $v ) ) {
		printf( "  %-40s array(%d) enabled=%s\n", $opt, count( $v ), $v['enabled'] ?? '(unset)' );
	} else {
		printf( "  %-40s %s\n", $opt, $v === false ? 'absent' : var_export( $v, true ) );
	}
}

echo "\n=== store basics ===\n";
printf( "  currency        : %s\n", get_option( 'woocommerce_currency' ) );
printf( "  country         : %s\n", get_option( 'woocommerce_default_country' ) );
