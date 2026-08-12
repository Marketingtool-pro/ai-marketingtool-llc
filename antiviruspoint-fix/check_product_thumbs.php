<?php
/**
 * Check whether product images have the sizes WooCommerce asks for.
 *
 * The cart shows a broken image, which matches the pattern already seen with the
 * footer logo and favicon: the backup carried the original uploads but not every
 * generated thumbnail, so any size WordPress records in metadata but has no file
 * for returns 404.
 *
 * This samples published products, resolves the size the cart uses
 * (woocommerce_thumbnail), and reports whether the file actually exists on disk.
 *
 * Run with:  wp eval-file check_product_thumbs.php
 */

$sizes_to_check = array( 'woocommerce_thumbnail', 'woocommerce_gallery_thumbnail', 'thumbnail' );

$products = get_posts( array(
	'post_type'      => 'product',
	'post_status'    => 'publish',
	'posts_per_page' => 25,
	'fields'         => 'ids',
) );

printf( "products sampled: %d\n\n", count( $products ) );

$uploads  = wp_upload_dir();
$basedir  = trailingslashit( $uploads['basedir'] );
$missing  = array();
$checked  = 0;
$no_image = 0;

foreach ( $products as $pid ) {
	$thumb_id = get_post_thumbnail_id( $pid );
	if ( ! $thumb_id ) {
		$no_image++;
		continue;
	}

	foreach ( $sizes_to_check as $size ) {
		$src = wp_get_attachment_image_src( $thumb_id, $size );
		if ( ! $src ) {
			continue;
		}
		$checked++;

		// Map the URL back to a path under uploads.
		$rel = str_replace( trailingslashit( $uploads['baseurl'] ), '', $src[0] );
		$abs = $basedir . $rel;

		if ( ! file_exists( $abs ) ) {
			$missing[] = sprintf( '%-28s %s', $size, $rel );
		}
	}
}

printf( "size lookups checked : %d\n", $checked );
printf( "products with no image: %d\n", $no_image );
printf( "MISSING FILES        : %d\n\n", count( $missing ) );

foreach ( array_slice( $missing, 0, 20 ) as $m ) {
	echo "  $m\n";
}

echo "\n=== registered woo image sizes ===\n";
foreach ( array( 'woocommerce_thumbnail', 'woocommerce_single', 'woocommerce_gallery_thumbnail' ) as $s ) {
	$d = wc_get_image_size( $s );
	printf( "  %-30s %sx%s crop=%s\n", $s, $d['width'] ?? '?', $d['height'] ?? '?', ! empty( $d['crop'] ) ? 'yes' : 'no' );
}
