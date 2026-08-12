<?php
/**
 * Show every Filson theme-mod whose key or value mentions a logo.
 *
 * Used to locate where the header/footer logo image is configured so it can be
 * swapped without guessing. Prints keys and values only - these are image URLs
 * and attachment IDs, not secrets.
 *
 * Run with:  wp eval-file find_logo_setting.php
 */

$mods = get_option( 'theme_mods_filson' );

if ( ! is_array( $mods ) ) {
	echo "theme_mods_filson not found\n";
	return;
}

echo "total theme mods: " . count( $mods ) . "\n\n";
echo "=== keys or values mentioning logo / the current image ===\n";

foreach ( $mods as $key => $val ) {
	$flat = is_scalar( $val ) ? (string) $val : wp_json_encode( $val );

	$key_hit   = stripos( (string) $key, 'logo' ) !== false;
	$val_hit   = stripos( $flat, 'logo' ) !== false;
	$photoroom = stripos( $flat, 'Photoroom' ) !== false;

	if ( ! $key_hit && ! $val_hit && ! $photoroom ) {
		continue;
	}

	$show = strlen( $flat ) > 150 ? substr( $flat, 0, 150 ) . '...' : $flat;
	printf( "  %-28s = %s%s\n", $key, $show, $photoroom ? '   <-- CURRENT LOGO' : '' );
}

echo "\n=== header builder posts (visualheader) ===\n";
$posts = get_posts( array(
	'post_type'      => 'visualheader',
	'posts_per_page' => 10,
	'post_status'    => 'any',
) );
foreach ( $posts as $p ) {
	printf( "  ID %-8d %-30s %s\n", $p->ID, $p->post_title, $p->post_status );
}
if ( ! $posts ) {
	echo "  (none)\n";
}
