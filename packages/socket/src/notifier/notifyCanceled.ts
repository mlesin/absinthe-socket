import observerNotifyAll from './observer/notifyAll';
import { Event, Notifier } from './types';

const notifyCanceled = (notifier: Notifier, event: Event): Notifier => {
  observerNotifyAll(notifier.canceledObservers, event);
  return notifier;
};

export default notifyCanceled;
