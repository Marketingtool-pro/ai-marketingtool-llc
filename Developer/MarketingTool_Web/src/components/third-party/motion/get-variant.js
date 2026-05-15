// @project
import { varFade, varSlide, varZoom, varFlip, varBounce, varRotate, varScale } from './animate/dialog/index';

/***************************  ANIMATION - VARIANTS  ***************************/

export function getVariant(variant = 'slideInUp', distance = 160) {
  const variants = {
    // Slide
    slideInUp: varSlide('slideInUp', { distance }),
    slideInDown: varSlide('slideInDown', { distance }),
    slideInLeft: varSlide('slideInLeft', { distance }),
    slideInRight: varSlide('slideInRight', { distance }),
    slideOutUp: varSlide('slideOutUp', { distance }),
    slideOutDown: varSlide('slideOutDown', { distance }),
    slideOutLeft: varSlide('slideOutLeft', { distance }),
    slideOutRight: varSlide('slideOutRight', { distance }),
    // Fade
    fadeIn: varFade('fadeIn'),
    fadeInUp: varFade('fadeInUp', { distance }),
    fadeInDown: varFade('fadeInDown', { distance }),
    fadeInLeft: varFade('fadeInLeft', { distance }),
    fadeInRight: varFade('fadeInRight', { distance }),
    fadeOut: varFade('fadeOut', { distance }),
    fadeOutUp: varFade('fadeOutUp', { distance }),
    fadeOutDown: varFade('fadeOutDown', { distance }),
    fadeOutLeft: varFade('fadeOutLeft', { distance }),
    fadeOutRight: varFade('fadeOutRight', { distance }),
    // Zoom
    zoomIn: varZoom('zoomIn', { distance: 80 }),
    zoomInUp: varZoom('zoomInUp', { distance: 80 }),
    zoomInDown: varZoom('zoomInDown', { distance: 80 }),
    zoomInLeft: varZoom('zoomInLeft', { distance: 240 }),
    zoomInRight: varZoom('zoomInRight', { distance: 240 }),
    zoomOut: varZoom('zoomOut'),
    zoomOutLeft: varZoom('zoomOutLeft'),
    zoomOutRight: varZoom('zoomOutRight'),
    zoomOutUp: varZoom('zoomOutUp'),
    zoomOutDown: varZoom('zoomOutDown'),
    // Bounce
    bounceIn: varBounce('bounceIn'),
    bounceInUp: varBounce('bounceInUp', { transition: { duration: 0.8 } }),
    bounceInDown: varBounce('bounceInDown', { transition: { duration: 0.8 } }),
    bounceInLeft: varBounce('bounceInLeft', { transition: { duration: 0.8 } }),
    bounceInRight: varBounce('bounceInRight', { transition: { duration: 0.8 } }),
    bounceOut: varBounce('bounceOut'),
    bounceOutUp: varBounce('bounceOutUp', { transition: { duration: 1 } }),
    bounceOutDown: varBounce('bounceOutDown', { transition: { duration: 1 } }),
    bounceOutLeft: varBounce('bounceOutLeft', { transition: { duration: 1 } }),
    bounceOutRight: varBounce('bounceOutRight', { transition: { duration: 1 } }),
    // Flip
    flipInX: varFlip('flipInX'),
    flipInY: varFlip('flipInY'),
    flipOutX: varFlip('flipOutX'),
    flipOutY: varFlip('flipOutY'),
    // Scale
    scaleInX: varScale('scaleInX'),
    scaleInY: varScale('scaleInY'),
    scaleOutX: varScale('scaleOutX'),
    scaleOutY: varScale('scaleOutY'),
    // Rotate
    rotateIn: varRotate('rotateIn'),
    rotateOut: varRotate('rotateOut')
  };

  return variants[variant];
}
