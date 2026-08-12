<?php
/**
 * Swap the header logo in the Visual Header builder.
 *
 *   from 90008369  cropped-Photoroom-20250914_095304050.png  (circuit-board art)
 *   to   90007285  antiviruspoint-logos-1.png                (navy/orange shield)
 *
 * filson/header/logo.php resolves the logo via
 * wp_get_attachment_image_src( $opt['logo'] ), so the builder stores an
 * attachment ID. The builder JSON is URL-encoded, but digits are not altered by
 * URL encoding, so replacing the ID as a plain string is safe at any encoding
 * depth and does not disturb the surrounding structure.
 *
 * The previous value is saved to vh_builder_json_backup_logo first, so this is
 * reversible.
 *
 * Run with:  wp eval-file swap_header_logo.php
 */

const HEADER_POST = 800394;
const OLD_ID      = '90008369';
const NEW_ID      = '90007285';

$raw = get_post_meta( HEADER_POST, 'vh_builder_json', true );

if ( ! $raw ) {
	echo "no vh_builder_json on post " . HEADER_POST . "\n";
	return;
}

$before = substr_count( $raw, OLD_ID );
echo "occurrences of old id {$before}\n";

if ( ! $before ) {
	echo "nothing to change\n";
	return;
}

// Keep a one-time backup of the original value.
if ( ! get_post_meta( HEADER_POST, 'vh_builder_json_backup_logo', true ) ) {
	update_post_meta( HEADER_POST, 'vh_builder_json_backup_logo', $raw );
	echo "backup saved to vh_builder_json_backup_logo\n";
} else {
	echo "backup already exists, left untouched\n";
}

$updated = str_replace( OLD_ID, NEW_ID, $raw );

if ( strlen( $updated ) !== strlen( $raw ) ) {
	echo "ABORT: length changed unexpectedly\n";
	return;
}

update_post_meta( HEADER_POST, 'vh_builder_json', wp_slash( $updated ) );

$check = get_post_meta( HEADER_POST, 'vh_builder_json', true );
printf( "old id remaining : %d\n", substr_count( $check, OLD_ID ) );
printf( "new id present   : %d\n", substr_count( $check, NEW_ID ) );

$src = wp_get_attachment_image_src( (int) NEW_ID, 'full' );
printf( "new logo file    : %s\n", $src ? basename( $src[0] ) : 'NOT FOUND' );
