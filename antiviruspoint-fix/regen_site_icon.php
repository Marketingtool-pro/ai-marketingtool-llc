<?php
/**
 * Regenerate the WordPress site-icon (favicon) sizes for the current site icon.
 *
 * The migrated site had site_icon set to a valid attachment whose original file
 * exists, but its metadata only carried the "medium" and "thumbnail" sizes, so
 * the 32x32 / 180x180 / 192x192 favicon URLs in <head> all returned 404.
 *
 * WordPress only produces those sizes while an image is being set as the Site
 * Icon, because WP_Site_Icon injects them through the
 * `intermediate_image_sizes_advanced` filter. Re-running metadata generation
 * with that filter attached recreates exactly the same sizes WordPress would
 * have made, so the icon stays the one the owner already chose.
 *
 * Run with:  wp eval-file regen_site_icon.php
 */

$icon_id = (int) get_option( 'site_icon' );

if ( ! $icon_id ) {
	echo "no site_icon set\n";
	return;
}

$file = get_attached_file( $icon_id );

if ( ! $file || ! file_exists( $file ) ) {
	echo "site icon source file missing for attachment {$icon_id}\n";
	return;
}

require_once ABSPATH . 'wp-admin/includes/class-wp-site-icon.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$site_icon = new WP_Site_Icon();
add_filter( 'intermediate_image_sizes_advanced', array( $site_icon, 'additional_sizes' ) );

$meta = wp_generate_attachment_metadata( $icon_id, $file );
wp_update_attachment_metadata( $icon_id, $meta );

remove_filter( 'intermediate_image_sizes_advanced', array( $site_icon, 'additional_sizes' ) );

$sizes = array_keys( (array) ( $meta['sizes'] ?? array() ) );

echo "attachment : {$icon_id}\n";
echo "source     : " . basename( $file ) . "\n";
echo "sizes now  : " . implode( ', ', $sizes ) . "\n";
