<?php
/**
 * Locate the logo image inside the Visual Header builder JSON.
 *
 * vh_builder_json is stored URL-encoded (and in places double-URL-encoded), so
 * a plain search for the image filename misses it. This decodes progressively
 * and reports every distinct occurrence together with the encoding depth it was
 * found at, so the right replacement string can be built.
 *
 * Run with:  wp eval-file find_logo_in_header.php
 */

const HEADER_POST = 800394;
const NEEDLE      = 'Photoroom-20250914_095304050';

$raw = get_post_meta( HEADER_POST, 'vh_builder_json', true );

if ( ! $raw ) {
	echo "vh_builder_json empty for post " . HEADER_POST . "\n";
	return;
}

printf( "raw length: %d\n\n", strlen( $raw ) );

$layer = $raw;
for ( $depth = 0; $depth <= 3; $depth++ ) {
	$count = substr_count( $layer, NEEDLE );
	printf( "decode depth %d : %d occurrence(s), length %d\n", $depth, $count, strlen( $layer ) );

	if ( $count ) {
		$off = 0;
		while ( ( $pos = strpos( $layer, NEEDLE, $off ) ) !== false ) {
			$start = max( 0, $pos - 120 );
			printf( "    ...%s...\n", substr( $layer, $start, 240 ) );
			$off = $pos + 1;
		}
		break;
	}

	$next = urldecode( $layer );
	if ( $next === $layer ) {
		break;
	}
	$layer = $next;
}

// Show which exact encoded forms of the filename exist in the stored value.
echo "\n=== encoded forms present in the STORED value ===\n";
$forms = array(
	'plain'          => NEEDLE,
	'url-encoded'    => rawurlencode( NEEDLE ),
	'slash-encoded'  => str_replace( '/', '%2F', NEEDLE ),
);
foreach ( $forms as $name => $form ) {
	printf( "  %-14s %s : %d\n", $name, $form, substr_count( $raw, $form ) );
}
