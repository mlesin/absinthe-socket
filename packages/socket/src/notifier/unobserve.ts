import {readonlyArrayRemove} from "../utils-array";

import {Notifier, Observer} from "./types";

const removeObserver = <R, V>(observers: ReadonlyArray<Observer<R, V>>, observer: Observer<R, V>) =>
  readonlyArrayRemove(observers.indexOf(observer), observers);

const unobserve = <R, V>({activeObservers, ...rest}: Notifier<R, V>, observer: Observer<R, V>): Notifier<R, V> => ({
  ...rest,
  activeObservers: removeObserver(activeObservers, observer),
});

export default unobserve;
