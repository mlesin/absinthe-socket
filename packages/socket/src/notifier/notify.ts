import observerNotifyAll from "./observer/notifyAll";

import {Event, Notifier} from "./types";

const getObservers = <R, V>({activeObservers, canceledObservers}: Notifier<R, V>) => [...activeObservers, ...canceledObservers];

const notify = <R, V>(notifier: Notifier<R, V>, event: Event<R, V>): Notifier<R, V> => {
  observerNotifyAll(getObservers(notifier), event);

  return notifier;
};

export default notify;
