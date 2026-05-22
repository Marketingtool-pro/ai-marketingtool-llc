// @project
import { transitionExit, transitionEnter } from '../transition';

export function varSlide(direction, options) {
  const distance = options?.distance || 160;
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const slideVariants = {
    slideInUp: {
      initial: { y: distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { y: distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    slideInDown: {
      initial: { y: -distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { y: -distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    slideInLeft: {
      initial: { x: distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { x: distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    slideInRight: {
      initial: { x: -distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { x: -distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    slideOutUp: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -distance, opacity: 0, transition: transitionEnter(transitionIn) },
      exit: { y: distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    slideOutDown: {
      initial: { y: 0, opacity: 1 },
      animate: { y: distance, opacity: 0, transition: transitionEnter(transitionIn) },
      exit: { y: -distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    slideOutLeft: {
      initial: { x: 0, opacity: 1 },
      animate: { x: -distance, opacity: 0, transition: transitionEnter(transitionIn) },
      exit: { x: distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    slideOutRight: {
      initial: { x: 0, opacity: 1 },
      animate: { x: distance, opacity: 0, transition: transitionEnter(transitionIn) },
      exit: { x: -distance, opacity: 0, transition: transitionExit(transitionOut) }
    }
  };

  return slideVariants[direction];
}
