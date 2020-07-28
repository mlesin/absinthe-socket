import observerNotifyAll from "./observer/notifyAll";

import {Event, Notifier} from "./types";

const getObservers = <Result, Variables>({activeObservers, canceledObservers}: Notifier<Result, Variables>) => [
  ...activeObservers,
  ...canceledObservers,
];

const notify = <Result, Variables>(notifier: Notifier<Result, Variables>, event: Event<Result, Variables>): Notifier<Result, Variables> => {
  observerNotifyAll(getObservers(notifier), event);

  return notifier;
};

export default notify;
