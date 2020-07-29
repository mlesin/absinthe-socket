import isDeepEqual from "fast-deep-equal";
import {arrayRemove} from "../utils-array";
import {Notifier} from "./types";

const remove = <R, V>(notifier: Notifier<R, V>) => (notifiers: Array<Notifier<R, V>>): Array<Notifier<R, V>> =>
  arrayRemove(
    notifiers.findIndex((ntf) => isDeepEqual(ntf.request, notifier.request)),
    notifiers
  );

export default remove;
