export function transitionEnter(props) {
  return {
    duration: 0.2,
    ease: [0.43, 0.13, 0.23, 0.96],
    ...props
  };
}

export function transitionExit(props) {
  return {
    duration: 0.2,
    ease: [0.43, 0.13, 0.23, 0.96],
    ...props
  };
}
