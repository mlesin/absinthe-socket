import * as A from "fp-ts/lib/Array";
import * as ROA from "fp-ts/lib/ReadonlyArray";

/**
 * Returns a new Array with the result of having removed the specified element
 * at the given index
 * @param element Element to remove
 * @param array Source Array
 */
export const arrayRemove = <E>(index: number, array: Array<E>): Array<E> => A.filterWithIndex<E>((i, _) => index !== i)(array);

/**
 * Returns a new ReadonlyArray with the result of having removed the specified element
 * at the given index
 * @param element Element to remove
 * @param array Source ReadonlyArray
 */
export const readonlyArrayRemove = <Element>(index: number, array: ReadonlyArray<Element>): ReadonlyArray<Element> =>
  ROA.filterWithIndex<Element>((i, _) => index !== i)(array);
