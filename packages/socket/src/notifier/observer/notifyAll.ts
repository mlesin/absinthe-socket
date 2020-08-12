import { Event, Observer, Notifier } from '../types';

const getNotifier = (handlerName: keyof Observer, payload: unknown) => (observer: Observer) => {
  switch (handlerName) {
    case 'onAbort':
      observer.onAbort?.(payload as Error);
      break;
    case 'onCancel':
      observer.onCancel?.();
      break;
    case 'onError':
      observer.onError?.(payload as Error);
      break;
    case 'onResult':
      observer.onResult?.(payload as Record<string, unknown>);
      break;
    case 'onStart':
      observer.onStart?.(payload as Notifier);
      break;
  }
};

// const getHandlerName = ({name}: Event) => `on${name}`;

const notifyAll = (observers: ReadonlyArray<Observer>, event: Event): void => observers.forEach(getNotifier(event.tag, event.payload));

export default notifyAll;
