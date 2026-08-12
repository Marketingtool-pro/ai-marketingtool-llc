<?php
/**
 * Show where the old circuit-board logo is still used outside the header.
 *
 * The header now uses attachment 90007285 (antiviruspoint-logos-1.png, the
 * shield). This reports the remaining places still pointing at the old image so
 * they can be switched to match.
 *
 * Run with:  wp eval-file inspect_footer_logo.php
 */

const OLD_NAME = 'Photoroom-20250914_095304050';
const NEW_ID   = 90007285;

echo "=== text widgets referencing the old logo ===\n";
$widgets = get_option( 'widget_text' );
if ( is_array( $widgets ) ) {
	foreach ( $widgets as $idx => $w ) {
		if ( ! is_array( $w ) ) {
			continue;
		}
		$content = $w['text'] ?? '';
		if ( strpos( $content, OLD_NAME ) === false ) {
			continue;
		}
		printf( "  widget_text[%s] title=%s\n", $idx, $w['title'] ?? '(none)' );
		printf( "    content: %s\n", trim( preg_replace( '/\s+/', ' ', $content ) ) );
	}
}

echo "\n=== site icon (favicon) ===\n";
$icon = (int) get_option( 'site_icon' );
printf( "  site_icon attachment : %d\n", $icon );
if ( $icon ) {
	$src = wp_get_attachment_image_src( $icon, 'full' );
	printf( "  file                 : %s\n", $src ? basename( $src[0] ) : 'missing' );
}

echo "\n=== custom_logo theme mod ===\n";
printf( "  custom_logo : %s\n", get_theme_mod( 'custom_logo' ) ?: '(unset)' );

echo "\n=== target logo ===\n";
$src = wp_get_attachment_image_src( NEW_ID, 'full' );
if ( $src ) {
	printf( "  id %d -> %s (%dx%d)\n", NEW_ID, basename( $src[0] ), $src[1], $src[2] );
}
