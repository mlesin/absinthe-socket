import Observable from 'zen-observable';
import isDeepEqual from 'fast-deep-equal';
import observe from './observe';
import { AbsintheSocket } from './types';
import { Notifier, Observer } from './notifier/types';

export interface Options {
  onError: Observer['onError'];
  onStart: Observer['onStart'];
  unsubscribe: (absintheSocket: AbsintheSocket, notifier?: Notifier, observer?: Observer) => void;
}

const getUnsubscriber = (
  absintheSocket: AbsintheSocket,
  { request }: Notifier,
  observer: Observer,
  unsubscribe: Options['unsubscribe'],
) => () => {
  const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.request, request));
  unsubscribe(absintheSocket, notifier, notifier ? observer : undefined);
};

const onResult = <R>({ operationType }: Notifier, observableObserver: ZenObservable.SubscriptionObserver<R>) => (result: R) => {
  observableObserver.next(result);

  if (operationType !== 'subscription') {
    observableObserver.complete();
  }
};

const createObserver = (
  notifier: Notifier,
  handlers: Omit<Options, 'unsubscribe'>,
  observableObserver: ZenObservable.SubscriptionObserver<Record<string, unknown>>,
): Observer => ({
  ...handlers,
  onAbort: observableObserver.error.bind(observableObserver),
  onResult: onResult(notifier, observableObserver),
});

/**
 * Creates an Observable that will follow the given notifier
 *
 * @param {AbsintheSocket} absintheSocket
 * @param {Notifier} notifier
 * @param {Object} [options]
 * @param {function(error: Error): undefined} [options.onError]
 * @param {function(notifier: Notifier): undefined} [options.onStart]
 * @param {function(): undefined} [options.unsubscribe]
 *
 * @return {Observable}
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * const unobserveOrCancelIfNeeded = (absintheSocket, notifier, observer) => {
 *   if (notifier && observer) {
 *     withAbsintheSocket.unobserveOrCancel(absintheSocket, notifier, observer);
 *   }
 * };
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const observable = withAbsintheSocket.toObservable(absintheSocket, notifier, {
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   unsubscribe: unobserveOrCancelIfNeeded
 * });
 */
const toObservable = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier,
  { unsubscribe, ...handlers }: Options,
): Observable<Record<string, unknown>> =>
  new Observable((observableObserver: ZenObservable.SubscriptionObserver<Record<string, unknown>>) => {
    const observer = createObserver(notifier, handlers, observableObserver);

    observe(absintheSocket, notifier, observer);

    return unsubscribe && getUnsubscriber(absintheSocket, notifier, observer, unsubscribe);
  });

export default toObservable;
