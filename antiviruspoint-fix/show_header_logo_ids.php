<?php
/**
 * Show the logo attachment IDs configured in the Visual Header builder.
 *
 * filson/header/logo.php resolves the logo with
 * wp_get_attachment_image_src( $opt['logo'] ), so the builder stores an
 * attachment ID, not a filename - which is why searching the database for the
 * image filename finds nothing.
 *
 * Run with:  wp eval-file show_header_logo_ids.php
 */

const HEADER_POST = 800394;

$raw = get_post_meta( HEADER_POST, 'vh_builder_json', true );
if ( ! $raw ) {
	echo "no vh_builder_json on post " . HEADER_POST . "\n";
	return;
}

// Decode until it stops changing, then parse.
$json = $raw;
for ( $i = 0; $i < 4; $i++ ) {
	$next = urldecode( $json );
	if ( $next === $json ) {
		break;
	}
	$json = $next;
}

$data = json_decode( $json, true );
if ( ! is_array( $data ) ) {
	echo "could not decode builder JSON; showing logo-ish fragments instead\n";
	preg_match_all( '/.{60}logo.{80}/i', $json, $m );
	foreach ( array_slice( $m[0], 0, 8 ) as $frag ) {
		echo '  ...' . $frag . "...\n";
	}
	return;
}

$found = array();

$walk = function ( $node, $path ) use ( &$walk, &$found ) {
	foreach ( (array) $node as $k => $v ) {
		$here = $path === '' ? (string) $k : $path . '.' . $k;
		if ( is_array( $v ) ) {
			$walk( $v, $here );
		} elseif ( stripos( (string) $k, 'logo' ) !== false ) {
			$found[ $here ] = $v;
		}
	}
};
$walk( $data, '' );

echo "=== logo settings in the header builder ===\n";
foreach ( $found as $path => $val ) {
	$extra = '';
	if ( is_numeric( $val ) && (int) $val > 0 ) {
		$src = wp_get_attachment_image_src( (int) $val, 'full' );
		if ( $src ) {
			$extra = '  ->  ' . basename( $src[0] );
		}
	}
	printf( "  %-46s = %s%s\n", $path, is_scalar( $val ) ? $val : gettype( $val ), $extra );
}
if ( ! $found ) {
	echo "  (none found)\n";
}
