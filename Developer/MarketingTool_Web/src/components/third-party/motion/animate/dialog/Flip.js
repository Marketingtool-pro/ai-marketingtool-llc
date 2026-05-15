// @project
import { transitionExit, transitionEnter } from '../transition';

export function varFlip(direction, options) {
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const variants = {
    /**** In ****/
    flipInX: {
      initial: { rotateX: -180, opacity: 0 },
      animate: { rotateX: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { rotateX: -180, opacity: 0, transition: transitionExit(transitionOut) }
    },
    flipInY: {
      initial: { rotateY: -180, opacity: 0 },
      animate: { rotateY: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { rotateY: -180, opacity: 0, transition: transitionExit(transitionOut) }
    },
    /**** Out ****/
    flipOutX: {
      initial: { rotateX: 0, opacity: 1 },
      animate: { rotateX: -180, opacity: 0, transition: transitionEnter(transitionIn) }
    },
    flipOutY: {
      initial: { rotateY: 0, opacity: 1 },
      animate: { rotateY: -180, opacity: 0, transition: transitionEnter(transitionIn) }
    }
  };

  return variants[direction];
}
