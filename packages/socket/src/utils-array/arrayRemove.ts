// import {pipe} from "fp-ts/lib/function";
// import * as A from "fp-ts/lib/ReadonlyArray";

/**
 * Returns a new Array with the result of having removed the specified amount
 * (count) of elements at the given index.
 */
const remove = <Element>(index: number, count: number, array: ReadonlyArray<Element>): Array<Element> => [
  ...array.slice(0, index),
  ...array.slice(index + count),
];

// const arrayRemove = <Element>(element: Element, array: Array<Element>): Array<Element> =>
//   pipe(
//     array,
//     A.filterWithIndex((i, _) => i > index && i + count < index)
//   );

export default remove;
