import observerNotifyAll from "./observer/notifyAll";

import {Event, Notifier} from "./types";

const getObservers = ({activeObservers, canceledObservers}) => [...activeObservers, ...canceledObservers];

const notify = <Result, Variables>(notifier: Notifier<Result, Variables>, event: Event): Notifier<Result, Variables> => {
  observerNotifyAll(getObservers(notifier), event);

  return notifier;
};

export default notify;
