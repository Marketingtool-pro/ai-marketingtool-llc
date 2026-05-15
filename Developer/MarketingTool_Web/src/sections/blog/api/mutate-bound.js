let boundMutate;

export function setMutateContext(mutate) {
  boundMutate = mutate;
}

/***************************  MUTATE - CONTEXT  ***************************/

export function getMutateContext() {
  if (!boundMutate) throw new Error('mutate is not set');
  return boundMutate;
}
