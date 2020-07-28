import {arrayRemove} from "../utils-array";

import {Notifier, Observer} from "./types";

const removeObserver = <Result, Variables>(observers: ReadonlyArray<Observer<Result, Variables>>, observer: Observer<Result, Variables>) =>
  arrayRemove(observers.indexOf(observer), 1, observers);

const unobserve = <Result, Variables>(
  {activeObservers, ...rest}: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>
): Notifier<Result, Variables> => ({
  ...rest,
  activeObservers: removeObserver(activeObservers, observer),
});

export default unobserve;
