import {Notifier, Observer} from "./types";

const observe = <R, V>({activeObservers, ...rest}: Notifier<R, V>, observer: Observer<R, V>): Notifier<R, V> => ({
  ...rest,
  activeObservers: [...activeObservers, observer],
  isActive: true,
});

export default observe;
