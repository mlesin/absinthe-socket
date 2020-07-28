import {Event, Observer, Notifier} from "../types";

const getNotifier = <Result, Variables>(handlerName: keyof Observer<Result, Variables>, payload: unknown) => (
  observer: Observer<Result, Variables>
) => {
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
      observer.onResult?.(payload as Result);
      break;
    case "onStart":
      observer.onStart?.(payload as Notifier<Result, Variables>);
      break;
  }
};

// const getHandlerName = ({name}: Event) => `on${name}`;

const notifyAll = <Result, Variables>(observers: ReadonlyArray<Observer<Result, Variables>>, event: Event<Result, Variables>): void =>
  observers.forEach(getNotifier<Result, Variables>(event.name, event.payload));

export default notifyAll;
