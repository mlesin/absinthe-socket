/**
 * Returns a new Array with elements appended to the one given.
 */
const arrayAppend = <E>(elements: Array<E>): ((array: Array<E>) => Array<E>) => (array) => [
  ...array,
  ...elements,
];

export default arrayAppend;
