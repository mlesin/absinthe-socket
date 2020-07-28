import {remove as arrayRemove} from "@jumpn/utils-array";
import findIndex from "./findIndex";
import {Notifier} from "./types";

const remove = <Result, Variables>(notifier: Notifier<Result, Variables>) => (notifiers: Array<Notifier<Result, Variables>>) =>
  arrayRemove(findIndex(notifiers, "request", notifier.request), 1, notifiers);

export default remove;
