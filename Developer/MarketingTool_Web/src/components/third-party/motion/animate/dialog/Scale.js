// @project
import { transitionExit, transitionEnter } from '../transition';

export function varScale(direction, options) {
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const variants = {
    /**** In ****/
    scaleIn: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { scale: 0, opacity: 0, transition: transitionExit(transitionOut) }
    },
    scaleInX: {
      initial: { scaleX: 0, opacity: 0 },
      animate: { scaleX: 1, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { scaleX: 0, opacity: 0, transition: transitionExit(transitionOut) }
    },
    scaleInY: {
      initial: { scaleY: 0, opacity: 0 },
      animate: { scaleY: 1, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { scaleY: 0, opacity: 0, transition: transitionExit(transitionOut) }
    },
    /**** Out ****/
    scaleOut: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, transition: transitionEnter(transitionIn) }
    },
    scaleOutX: {
      initial: { scaleX: 1, opacity: 1 },
      animate: { scaleX: 0, opacity: 0, transition: transitionEnter(transitionIn) }
    },
    scaleOutY: {
      initial: { scaleY: 1, opacity: 1 },
      animate: { scaleY: 0, opacity: 0, transition: transitionEnter(transitionIn) }
    }
  };

  return variants[direction];
}
