import {pipe} from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as ROA from "fp-ts/lib/ReadonlyArray";

/**
 * Returns a new Array with the result of having removed the specified amount
 * (count) of elements at the given index.
 */
// const remove = <Element>(index: number, count: number, array: ReadonlyArray<Element>): Array<Element> => [
//   ...array.slice(0, index),
//   ...array.slice(index + count),
// ];

/**
 * Returns a new Array with the result of having removed the specified element
 * at the given index
 * @param element Element to remove
 * @param array Source array
 */
export const arrayRemove = <Element>(index: number, array: Array<Element>): Array<Element> =>
  pipe(
    array,
    A.filterWithIndex((i, _) => index !== i)
  );

export const readonlyArrayRemove = <Element>(index: number, array: ReadonlyArray<Element>): ReadonlyArray<Element> =>
  pipe(
    array,
    ROA.filterWithIndex((i, _) => index !== i)
  );
