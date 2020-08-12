import observerNotifyAll from './observer/notifyAll';

import { Event, Notifier } from './types';

const getObservers = ({ activeObservers, canceledObservers }: Notifier) => [...activeObservers, ...canceledObservers];

const notify = (notifier: Notifier, event: Event): Notifier => {
  observerNotifyAll(getObservers(notifier), event);

  return notifier;
};

export default notify;
