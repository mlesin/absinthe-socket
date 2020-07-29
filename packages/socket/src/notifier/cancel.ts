import {Notifier} from "./types";

const cancel = <R, V>({activeObservers, canceledObservers, ...rest}: Notifier<R, V>): Notifier<R, V> => ({
  ...rest,
  isActive: false,
  activeObservers: [],
  canceledObservers: [...activeObservers, ...canceledObservers],
});

export default cancel;
