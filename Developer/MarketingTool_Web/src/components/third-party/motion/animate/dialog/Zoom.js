// @project
import { transitionExit, transitionEnter } from '../transition';

export function varZoom(direction, options) {
  const distance = options?.distance || 720;
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const variants = {
    zoomIn: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: transitionEnter(transitionIn) },
      exit: { scale: 0, opacity: 0, transition: transitionExit(transitionOut) }
    },
    zoomInUp: {
      initial: { scale: 0, opacity: 0, translateY: distance },
      animate: { scale: 1, opacity: 1, translateY: 0, transition: transitionEnter(transitionIn) },
      exit: { scale: 0, opacity: 0, translateY: distance, transition: transitionExit(transitionOut) }
    },
    zoomInDown: {
      initial: { scale: 0, opacity: 0, translateY: -distance },
      animate: { scale: 1, opacity: 1, translateY: 0, transition: transitionEnter(transitionIn) },
      exit: { scale: 0, opacity: 0, translateY: -distance, transition: transitionExit(transitionOut) }
    },
    zoomInLeft: {
      initial: { scale: 0, opacity: 0, translateX: -distance },
      animate: { scale: 1, opacity: 1, translateX: 0, transition: transitionEnter(transitionIn) },
      exit: { scale: 0, opacity: 0, translateX: -distance, transition: transitionExit(transitionOut) }
    },
    zoomInRight: {
      initial: { scale: 0, opacity: 0, translateX: distance },
      animate: { scale: 1, opacity: 1, translateX: 0, transition: transitionEnter(transitionIn) },
      exit: { scale: 0, opacity: 0, translateX: distance, transition: transitionExit(transitionOut) }
    },
    /**** Out ****/
    zoomOut: { initial: { scale: 1, opacity: 1 }, animate: { scale: 0, opacity: 0, transition: transitionEnter(transitionIn) } },
    zoomOutUp: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, translateY: -distance, transition: transitionEnter(transitionIn) }
    },
    zoomOutDown: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, translateY: distance, transition: transitionEnter(transitionIn) }
    },
    zoomOutLeft: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, translateX: -distance, transition: transitionEnter(transitionIn) }
    },
    zoomOutRight: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, translateX: distance, transition: transitionEnter(transitionIn) }
    }
  };

  return variants[direction];
}
