// @project
import { transitionExit, transitionEnter } from '../transition';

export function varFade(direction, options) {
  const distance = options?.distance || 160;
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const fadeVariants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { opacity: 0, transition: transitionExit(transitionOut) }
    },
    fadeInUp: {
      initial: { y: distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { y: distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    fadeInDown: {
      initial: { y: -distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { y: -distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    fadeInLeft: {
      initial: { x: -distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { x: -distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    fadeInRight: {
      initial: { x: distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { x: distance, opacity: 0, transition: transitionExit(transitionOut) }
    },
    fadeOut: {
      initial: { opacity: 1 },
      animate: { opacity: 0, transition: transitionEnter(transitionIn) },
      exit: { opacity: 1, transition: transitionExit(transitionOut) }
    },
    fadeOutUp: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -distance, opacity: 0, transition: transitionEnter(transitionIn) },
      exit: { y: 0, opacity: 1, transition: transitionExit(transitionOut) }
    },
    fadeOutDown: {
      initial: { y: 0, opacity: 1 },
      animate: { y: distance, opacity: 0, transition: transitionEnter(transitionIn) },
      exit: { y: 0, opacity: 1, transition: transitionExit(transitionOut) }
    },
    fadeOutLeft: {
      initial: { x: 0, opacity: 1 },
      animate: { x: -distance, opacity: 0, transition: transitionEnter(transitionIn) },
      exit: { x: 0, opacity: 1, transition: transitionExit(transitionOut) }
    },
    fadeOutRight: {
      initial: { x: 0, opacity: 1 },
      animate: { x: distance, opacity: 0, transition: transitionEnter(transitionIn) },
      exit: { x: 0, opacity: 1, transition: transitionExit(transitionOut) }
    }
  };

  return fadeVariants[direction];
}
