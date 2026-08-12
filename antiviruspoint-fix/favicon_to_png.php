<?php
/**
 * Point the site icon at a PNG instead of a WebP.
 *
 * The square shield was registered in the media library as
 * cropped-antiviruspoint-logos-1-1.webp, so WordPress generated WebP favicons.
 * WebP favicons are fine in current browsers but are not universally handled by
 * older ones and some crawlers, and the identical PNG original is already on
 * disk beside it.
 *
 * Rather than rewriting _wp_attached_file on the existing attachment - which is
 * referenced elsewhere - this registers the PNG as its own attachment and points
 * site_icon at that. Nothing existing is modified.
 *
 * Run with:  wp eval-file favicon_to_png.php
 */

$rel = '2025/01/cropped-antiviruspoint-logos-1-1.png';

$uploads = wp_upload_dir();
$path    = trailingslashit( $uploads['basedir'] ) . $rel;

if ( ! file_exists( $path ) ) {
	echo "PNG not found: {$path}\n";
	return;
}

// Reuse an attachment for this exact file if one already exists.
global $wpdb;
$existing = $wpdb->get_var( $wpdb->prepare(
	"SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_wp_attached_file' AND meta_value = %s LIMIT 1",
	$rel
) );

if ( $existing ) {
	$id = (int) $existing;
	echo "reusing existing attachment {$id}\n";
} else {
	$id = wp_insert_attachment( array(
		'guid'           => trailingslashit( $uploads['baseurl'] ) . $rel,
		'post_mime_type' => 'image/png',
		'post_title'     => 'Antiviruspoint shield (square, PNG)',
		'post_content'   => '',
		'post_status'    => 'inherit',
	), $path );

	if ( is_wp_error( $id ) || ! $id ) {
		echo "failed to create attachment\n";
		return;
	}
	update_post_meta( $id, '_wp_attached_file', $rel );
	echo "created attachment {$id}\n";
}

require_once ABSPATH . 'wp-admin/includes/class-wp-site-icon.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$site_icon = new WP_Site_Icon();
add_filter( 'intermediate_image_sizes_advanced', array( $site_icon, 'additional_sizes' ) );

$meta = wp_generate_attachment_metadata( $id, $path );
wp_update_attachment_metadata( $id, $meta );

remove_filter( 'intermediate_image_sizes_advanced', array( $site_icon, 'additional_sizes' ) );

update_option( 'site_icon', $id );

$sizes = array_keys( (array) ( $meta['sizes'] ?? array() ) );
printf( "site_icon now : %d\n", (int) get_option( 'site_icon' ) );
printf( "file          : %s (%dx%d)\n", basename( $path ), $meta['width'] ?? 0, $meta['height'] ?? 0 );
printf( "icon sizes    : %s\n", implode( ', ', array_filter( $sizes, function ( $s ) {
	return strpos( $s, 'site_icon' ) === 0;
} ) ) );
