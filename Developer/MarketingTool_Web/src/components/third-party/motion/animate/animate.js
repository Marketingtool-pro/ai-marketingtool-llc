export function createAnimations(distance = 100) {
  const slideDistance = distance;
  const bounceDistance = distance * 2;

  const animations = {
    slideInUp: { initial: { y: slideDistance, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    slideInDown: { initial: { y: -slideDistance, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    slideInLeft: { initial: { x: -slideDistance, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    slideInRight: { initial: { x: slideDistance, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    slideOutUp: { initial: { y: 0, opacity: 1 }, animate: { y: -slideDistance, opacity: 0 } },
    slideOutDown: { initial: { y: 0, opacity: 1 }, animate: { y: slideDistance, opacity: 0 } },
    slideOutLeft: { initial: { x: 0, opacity: 1 }, animate: { x: -slideDistance, opacity: 0 } },
    slideOutRight: { initial: { x: 0, opacity: 1 }, animate: { x: slideDistance, opacity: 0 } },

    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    fadeOut: { initial: { opacity: 1 }, animate: { opacity: 0 } },
    fadeInUp: { initial: { y: slideDistance, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    fadeInDown: { initial: { y: -slideDistance, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    fadeInLeft: { initial: { x: -slideDistance, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    fadeInRight: { initial: { x: slideDistance, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    fadeOutUp: { initial: { y: 0, opacity: 1 }, animate: { y: -slideDistance, opacity: 0 } },
    fadeOutDown: { initial: { y: 0, opacity: 1 }, animate: { y: slideDistance, opacity: 0 } },
    fadeOutLeft: { initial: { x: 0, opacity: 1 }, animate: { x: -slideDistance, opacity: 0 } },
    fadeOutRight: { initial: { x: 0, opacity: 1 }, animate: { x: slideDistance, opacity: 0 } },

    zoomIn: { initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
    zoomInUp: { initial: { y: slideDistance, scale: 0.5, opacity: 0 }, animate: { y: 0, scale: 1, opacity: 1 } },
    zoomInDown: { initial: { y: -slideDistance, scale: 0.5, opacity: 0 }, animate: { y: 0, scale: 1, opacity: 1 } },
    zoomInLeft: { initial: { x: -slideDistance, scale: 0.5, opacity: 0 }, animate: { x: 0, scale: 1, opacity: 1 } },
    zoomInRight: { initial: { x: slideDistance, scale: 0.5, opacity: 0 }, animate: { x: 0, scale: 1, opacity: 1 } },
    zoomOut: { initial: { scale: 1, opacity: 1 }, animate: { scale: 0.5, opacity: 0 } },
    zoomOutUp: { initial: { y: 0, scale: 1, opacity: 1 }, animate: { y: -slideDistance, scale: 0.5, opacity: 0 } },
    zoomOutDown: { initial: { y: 0, scale: 1, opacity: 1 }, animate: { y: slideDistance, scale: 0.5, opacity: 0 } },
    zoomOutLeft: { initial: { x: 0, scale: 1, opacity: 1 }, animate: { x: -slideDistance, scale: 0.5, opacity: 0 } },
    zoomOutRight: { initial: { x: 0, scale: 1, opacity: 1 }, animate: { x: slideDistance, scale: 0.5, opacity: 0 } },

    bounceIn: {
      initial: { scale: 1.5, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 10 } }
    },
    bounceOut: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0.3, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 10 } }
    },
    bounceInUp: {
      initial: { y: bounceDistance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 10 } }
    },
    bounceInDown: {
      initial: { y: -bounceDistance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 10 } }
    },
    bounceOutUp: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -bounceDistance, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 10 } }
    },
    bounceOutDown: {
      initial: { y: 0, opacity: 1 },
      animate: { y: bounceDistance, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 10 } }
    },
    bounceInLeft: {
      initial: { x: -bounceDistance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 600, damping: 10 } }
    },
    bounceInRight: {
      initial: { x: bounceDistance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 600, damping: 10 } }
    },
    bounceOutLeft: {
      initial: { x: 0, opacity: 1 },
      animate: { x: -bounceDistance, opacity: 0, transition: { type: 'spring', stiffness: 400, damping: 10 } }
    },
    bounceOutRight: {
      initial: { x: 0, opacity: 1 },
      animate: { x: 300, opacity: 0, transition: { type: 'spring', stiffness: 400, damping: 10 } }
    },

    flipInX: { initial: { rotateX: -90, opacity: 0 }, animate: { rotateX: 0, opacity: 1 } },
    flipInY: { initial: { rotateY: -90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 } },
    flipOutX: { initial: { rotateX: 0, opacity: 1 }, animate: { rotateX: 90, opacity: 0 } },
    flipOutY: { initial: { rotateY: 0, opacity: 1 }, animate: { rotateY: 90, opacity: 0 } },
    scaleInX: { initial: { scaleX: 0.5, opacity: 0 }, animate: { scaleX: 1, opacity: 1 } },
    scaleInY: { initial: { scaleY: 0.5, opacity: 0 }, animate: { scaleY: 1, opacity: 1 } },
    scaleOutX: { initial: { scaleX: 1, opacity: 1 }, animate: { scaleX: 0.5, opacity: 0 } },
    scaleOutY: { initial: { scaleY: 1, opacity: 1 }, animate: { scaleY: 0.5, opacity: 0 } },
    rotateIn: { initial: { rotate: -180, opacity: 0 }, animate: { rotate: 0, opacity: 1 } },
    rotateOut: { initial: { rotate: 0, opacity: 1 }, animate: { rotate: 180, opacity: 0 } }
  };

  return animations;
}
