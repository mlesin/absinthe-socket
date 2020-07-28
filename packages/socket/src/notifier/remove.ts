import isDeepEqual from "fast-deep-equal";
import {arrayRemove} from "../utils-array";
// import findIndex from "./findIndex";
import {Notifier} from "./types";

const remove = <Result, Variables>(notifier: Notifier<Result, Variables>) => (
  notifiers: Array<Notifier<Result, Variables>>
): Array<Notifier<Result, Variables>> =>
  arrayRemove(
    notifiers.findIndex((ntf) => isDeepEqual(ntf.request, notifier.request)),
    notifiers
  );

export default remove;
