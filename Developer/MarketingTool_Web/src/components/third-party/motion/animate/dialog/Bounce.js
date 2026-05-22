// @project
import { transitionExit, transitionEnter } from '../transition';

export function varBounce(direction, options) {
  const distance = options?.distance || 720;

  const variants = {
    /**** In ****/
    bounceIn: {
      initial: {},
      animate: {
        scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
        opacity: [0, 1, 1, 1, 1, 1],
        transition: transitionEnter(options?.transition)
      }
    },
    bounceInUp: {
      initial: {},
      animate: {
        y: [distance, -24, 12, -4, 0],
        scaleY: [4, 0.9, 0.95, 0.985, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: { ...transitionEnter(options?.transition) }
      }
    },
    bounceInDown: {
      initial: {},
      animate: {
        y: [-distance, 24, -12, 4, 0],
        scaleY: [4, 0.9, 0.95, 0.985, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: transitionEnter(options?.transition)
      }
    },
    bounceInLeft: {
      initial: {},
      animate: {
        x: [-distance, 24, -12, 4, 0],
        scaleX: [3, 1, 0.98, 0.995, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: transitionEnter(options?.transition)
      }
    },
    bounceInRight: {
      initial: {},
      animate: {
        x: [distance, -24, 12, -4, 0],
        scaleX: [3, 1, 0.98, 0.995, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: transitionEnter(options?.transition)
      }
    },
    /**** Out ****/
    bounceOut: {
      animate: {
        scale: [0.9, 1.1, 0.3],
        opacity: [1, 1, 0],
        transition: transitionExit(options?.transition)
      }
    },
    bounceOutUp: {
      animate: {
        y: [-12, 24, -distance],
        scaleY: [0.985, 0.9, 3],
        opacity: [1, 1, 0],
        transition: transitionExit(options?.transition)
      }
    },
    bounceOutDown: {
      animate: {
        y: [12, -24, distance],
        scaleY: [0.985, 0.9, 3],
        opacity: [1, 1, 0],
        transition: transitionExit(options?.transition)
      }
    },
    bounceOutLeft: {
      animate: {
        x: [0, 24, -distance],
        scaleX: [1, 0.9, 2],
        opacity: [1, 1, 0],
        transition: transitionExit(options?.transition)
      }
    },
    bounceOutRight: {
      animate: {
        x: [0, -24, distance],
        scaleX: [1, 0.9, 2],
        opacity: [1, 1, 0],
        transition: transitionExit(options?.transition)
      }
    }
  };

  return variants[direction];
}
