// @project
import { transitionExit, transitionEnter } from '../transition';

export function varRotate(direction, options) {
  const deg = options?.deg || 360;
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const variants = {
    /**** In ****/
    rotateIn: {
      initial: { opacity: 0, rotate: -deg },
      animate: { opacity: 1, rotate: 0, transition: transitionEnter(transitionIn) },
      exit: { opacity: 0, rotate: -deg, transition: transitionExit(transitionOut) }
    },
    /**** Out ****/
    rotateOut: {
      initial: { opacity: 1, rotate: 0 },
      animate: { opacity: 0, rotate: -deg, transition: transitionExit(transitionOut) }
    }
  };

  return variants[direction];
}
