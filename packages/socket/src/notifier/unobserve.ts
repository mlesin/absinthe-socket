import {readonlyArrayRemove} from "../utils-array";

import {Notifier, Observer} from "./types";

const removeObserver = <Result, Variables>(observers: ReadonlyArray<Observer<Result, Variables>>, observer: Observer<Result, Variables>) =>
  readonlyArrayRemove(observers.indexOf(observer), observers);

const unobserve = <Result, Variables>(
  {activeObservers, ...rest}: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>
): Notifier<Result, Variables> => ({
  ...rest,
  activeObservers: removeObserver(activeObservers, observer),
});

export default unobserve;
