import observerNotifyAll from "./observer/notifyAll";
import {Event, Notifier} from "./types";

const notifyCanceled = <Result, Variables>(notifier: Notifier<Result, Variables>, event: Event): Notifier<Result, Variables> => {
  observerNotifyAll(notifier.canceledObservers, event);
  return notifier;
};

export default notifyCanceled;
