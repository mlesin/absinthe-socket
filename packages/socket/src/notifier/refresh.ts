import {replace as arrayReplace} from "@jumpn/utils-array";
import findIndex from "./findIndex";
import {Notifier} from "./types";

const refresh = <R, V>(notifier: Notifier<R, V>) => (notifiers: Array<Notifier<R, V>>): Array<Notifier<R, V>> =>
  arrayReplace(findIndex(notifiers, "request", notifier.request), [notifier], notifiers);

export default refresh;
