import {Event, Observer, Notifier} from "../types";

const getNotifier = <R, V>(handlerName: keyof Observer<R, V>, payload: unknown) => (observer: Observer<R, V>) => {
  switch (handlerName) {
    case "onAbort":
      observer.onAbort?.(payload as Error);
      break;
    case "onCancel":
      observer.onCancel?.();
      break;
    case "onError":
      observer.onError?.(payload as Error);
      break;
    case "onResult":
      observer.onResult?.(payload as R);
      break;
    case "onStart":
      observer.onStart?.(payload as Notifier<R, V>);
      break;
  }
};

// const getHandlerName = ({name}: Event) => `on${name}`;

const notifyAll = <R, V>(observers: ReadonlyArray<Observer<R, V>>, event: Event<R, V>): void =>
  observers.forEach(getNotifier<R, V>(event.tag, event.payload));

export default notifyAll;
