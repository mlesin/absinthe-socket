import * as A from "fp-ts/lib/Array";

/**
 * Returns a new Array with the result of having removed the specified element
 * at the given index
 * @param index Index of element to replace
 * @param replaceWith Element to replace
 * @param array Source Array
 */
const arrayReplace = <E>(index: number, replaceWith: E, array: Array<E>): Array<E> =>
  A.mapWithIndex<E, E>((i, el) => (index !== i ? el : replaceWith))(array);

export default arrayReplace;
