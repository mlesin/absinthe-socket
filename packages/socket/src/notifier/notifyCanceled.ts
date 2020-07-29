import observerNotifyAll from "./observer/notifyAll";
import {Event, Notifier} from "./types";

const notifyCanceled = <R, V>(notifier: Notifier<R, V>, event: Event<R, V>): Notifier<R, V> => {
  observerNotifyAll(notifier.canceledObservers, event);
  return notifier;
};

export default notifyCanceled;
