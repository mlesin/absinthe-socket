import observerNotifyAll from './observer/notifyAll';
import { Event, Notifier } from './types';

const notifyActive = (notifier: Notifier, event: Event): Notifier => {
  observerNotifyAll(notifier.activeObservers, event);
  return notifier;
};

export default notifyActive;
