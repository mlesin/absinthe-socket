import {remove as arrayRemove} from "@jumpn/utils-array";

import {Notifier, Observer} from "./types";

const removeObserver = (observers, observer) => arrayRemove(observers.indexOf(observer), 1, observers);

const unobserve = <Result, Variables>({activeObservers, ...rest}: Notifier<Result, Variables>, observer: Observer<Result, Variables>) => ({
  ...rest,
  activeObservers: removeObserver(activeObservers, observer),
});

export default unobserve;
