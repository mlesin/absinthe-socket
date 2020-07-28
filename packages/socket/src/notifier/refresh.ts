import {replace as arrayReplace} from "@jumpn/utils-array";
import findIndex from "./findIndex";
import {Notifier} from "./types";

const refresh = <Result, Variables>(notifier: Notifier<Result, Variables>) => (notifiers: Array<Notifier<Result, Variables>>) =>
  arrayReplace(findIndex(notifiers, "request", notifier.request), [notifier], notifiers);

export default refresh;
