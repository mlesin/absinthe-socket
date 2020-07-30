import Observable from "zen-observable";
import isDeepEqual from "fast-deep-equal";
import observe from "./observe";
import {AbsintheSocket} from "./types";
import {Notifier, Observer} from "./notifier/types";

export type Options<R, V> = {
  onError: Observer<R, V>["onError"];
  onStart: Observer<R, V>["onStart"];
  unsubscribe: (absintheSocket: AbsintheSocket<R, V>, notifier?: Notifier<R, V>, observer?: Observer<R, V>) => void;
};

const getUnsubscriber = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  {request}: Notifier<R, V>,
  observer: Observer<R, V>,
  unsubscribe: Options<R, V>["unsubscribe"]
) => () => {
  const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.request, request));
  unsubscribe(absintheSocket, notifier, notifier ? observer : undefined);
};

const onResult = <R, V>({operationType}: Notifier<R, V>, observableObserver: ZenObservable.SubscriptionObserver<R>) => (result: R) => {
  observableObserver.next(result);

  if (operationType !== "subscription") {
    observableObserver.complete();
  }
};

const createObserver = <R, V>(
  notifier: Notifier<R, V>,
  handlers: Omit<Options<R, V>, "unsubscribe">,
  observableObserver: ZenObservable.SubscriptionObserver<R>
): Observer<R, V> => ({
  ...handlers,
  onAbort: observableObserver.error.bind(observableObserver),
  onResult: onResult(notifier, observableObserver),
});

/**
 * Creates an Observable that will follow the given notifier
 *
 * @param {AbsintheSocket} absintheSocket
 * @param {Notifier<R, V>} notifier
 * @param {Object} [options]
 * @param {function(error: Error): undefined} [options.onError]
 * @param {function(notifier: Notifier<R, V>): undefined} [options.onStart]
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
const toObservable = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  notifier: Notifier<R, V>,
  {unsubscribe, ...handlers}: Options<R, V>
): Observable<R> =>
  new Observable<R>((observableObserver: ZenObservable.SubscriptionObserver<R>) => {
    const observer = createObserver(notifier, handlers, observableObserver);

    observe(absintheSocket, notifier, observer);

    return unsubscribe && getUnsubscriber(absintheSocket, notifier, observer, unsubscribe);
  });

export default toObservable;
