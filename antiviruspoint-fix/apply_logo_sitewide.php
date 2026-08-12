<?php
/**
 * Roll the shield logo out to the rest of the site.
 *
 * The header already uses attachment 90007285 (antiviruspoint-logos-1.png).
 * Two places still showed the old circuit-board artwork:
 *
 *   footer  widget_text[3] embeds cropped-Photoroom-...-300x300.png
 *   favicon site_icon points at attachment 90008420
 *
 * Each is switched to the shield variant made for that job rather than reusing
 * one file everywhere:
 *
 *   footer  -> 90007286  antiviruspoint-logos-footer.png       510x550
 *   favicon -> 90007398  cropped-antiviruspoint-logos-1-1.webp 512x512 (square,
 *              so WordPress does not crop the mark to make it fit)
 *
 * Both previous values are backed up first, so this is reversible.
 *
 * Run with:  wp eval-file apply_logo_sitewide.php
 */

const FOOTER_ID  = 90007286;
const FAVICON_ID = 90007398;
const OLD_NAME   = 'Photoroom-20250914_095304050';

/* ---------------------------------------------------------------- footer -- */

$widgets = get_option( 'widget_text' );
$changed = 0;

if ( is_array( $widgets ) ) {
	if ( ! get_option( 'avp_widget_text_backup' ) ) {
		update_option( 'avp_widget_text_backup', $widgets, false );
		echo "backup saved to option avp_widget_text_backup\n";
	}

	$src = wp_get_attachment_image_src( FOOTER_ID, 'full' );
	if ( ! $src ) {
		echo "ABORT: footer logo attachment missing\n";
		return;
	}

	foreach ( $widgets as $idx => $w ) {
		if ( ! is_array( $w ) || empty( $w['text'] ) ) {
			continue;
		}
		if ( strpos( $w['text'], OLD_NAME ) === false ) {
			continue;
		}

		// Replace the whole <img ...> tag with one built from the new attachment.
		$new_img = sprintf(
			'<img class="alignnone wp-image-%d" src="%s" alt="Antiviruspoint" width="%d" height="%d" />',
			FOOTER_ID,
			esc_url( $src[0] ),
			(int) round( $src[1] / 2 ),
			(int) round( $src[2] / 2 )
		);

		$widgets[ $idx ]['text'] = preg_replace( '/<img\b[^>]*>/i', $new_img, $w['text'], 1 );
		$changed++;
		printf( "footer widget_text[%s] updated\n", $idx );
	}

	if ( $changed ) {
		update_option( 'widget_text', $widgets );
	}
}

printf( "footer widgets changed: %d\n", $changed );

/* --------------------------------------------------------------- favicon -- */

$old_icon = (int) get_option( 'site_icon' );
if ( ! get_option( 'avp_site_icon_backup' ) ) {
	update_option( 'avp_site_icon_backup', $old_icon, false );
	echo "backup saved to option avp_site_icon_backup ({$old_icon})\n";
}

update_option( 'site_icon', FAVICON_ID );

require_once ABSPATH . 'wp-admin/includes/class-wp-site-icon.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$site_icon = new WP_Site_Icon();
add_filter( 'intermediate_image_sizes_advanced', array( $site_icon, 'additional_sizes' ) );

$file = get_attached_file( FAVICON_ID );
$meta = wp_generate_attachment_metadata( FAVICON_ID, $file );
wp_update_attachment_metadata( FAVICON_ID, $meta );

remove_filter( 'intermediate_image_sizes_advanced', array( $site_icon, 'additional_sizes' ) );

printf( "site_icon now : %d (%s)\n", (int) get_option( 'site_icon' ), basename( $file ) );
printf( "icon sizes    : %s\n", implode( ', ', array_keys( (array) ( $meta['sizes'] ?? array() ) ) ) );
