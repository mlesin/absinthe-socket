import observerNotifyAll from "./observer/notifyAll";
import {Event, Notifier} from "./types";

const notifyActive = <R, V>(notifier: Notifier<R, V>, event: Event<R, V>): Notifier<R, V> => {
  observerNotifyAll(notifier.activeObservers, event);
  return notifier;
};

export default notifyActive;
