import isDeepEqual from "fast-deep-equal";
import {arrayReplace} from "../utils-array";
import {Notifier} from "./types";

const refresh = <R, V>(notifier: Notifier<R, V>) => (notifiers: Array<Notifier<R, V>>): Array<Notifier<R, V>> =>
  arrayReplace(
    notifiers.findIndex((ntf) => isDeepEqual(ntf.request, notifier.request)),
    notifier,
    notifiers
  );

export default refresh;
