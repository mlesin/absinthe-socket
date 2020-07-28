import observerNotifyAll from "./observer/notifyAll";
import {Event, Notifier} from "./types";

const notifyActive = <Result, Variables>(notifier: Notifier<Result, Variables>, event: Event): Notifier<Result, Variables> => {
  observerNotifyAll(notifier.activeObservers, event);
  return notifier;
};

export default notifyActive;
