import Observable from "zen-observable";
import isDeepEqual from "fast-deep-equal";
import observe from "./observe";
import {AbsintheSocket} from "./types";
import {Notifier, Observer} from "./notifier/types";

type $ElementType<T extends {[P in K & unknown]?: unknown}, K extends keyof T | number> = T[K];

type Options<Result, Variables> = {
  onError: $ElementType<Observer<Result, Variables>, "onError">;
  onStart: $ElementType<Observer<Result, Variables>, "onStart">;
  unsubscribe: (
    absintheSocket: AbsintheSocket<Result, Variables>,
    notifier?: Notifier<Result, Variables>,
    observer?: Observer<Result, Variables>
  ) => void;
};

const getUnsubscriber = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  {request}: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>,
  unsubscribe: Options<Result, Variables>["unsubscribe"]
) => () => {
  const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.request, request));

  unsubscribe(absintheSocket, notifier, notifier ? observer : undefined);
};

const onResult = <T, Result, Variables>(
  {operationType}: Notifier<Result, Variables>,
  observableObserver: ZenObservable.SubscriptionObserver<T>
) => (result: T) => {
  observableObserver.next(result);

  if (operationType !== "subscription") {
    observableObserver.complete();
  }
};

const createObserver = <Result, Variables>(
  notifier: Notifier<Result, Variables>,
  handlers: Omit<Options<Result, Variables>, "unsubscribe">,
  observableObserver: ZenObservable.SubscriptionObserver<Result>
): Observer<Result, Variables> => ({
  ...handlers,
  onAbort: observableObserver.error.bind(observableObserver),
  onResult: onResult(notifier, observableObserver),
});

/**
 * Creates an Observable that will follow the given notifier
 *
 * @param {AbsintheSocket} absintheSocket
 * @param {Notifier<Result, Variables>} notifier
 * @param {Object} [options]
 * @param {function(error: Error): undefined} [options.onError]
 * @param {function(notifier: Notifier<Result, Variables>): undefined} [options.onStart]
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
const toObservable = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>,
  {unsubscribe, ...handlers}: Options<Result, Variables>
): Observable<Result> =>
  new Observable<Result>((observableObserver: ZenObservable.SubscriptionObserver<Result>) => {
    const observer = createObserver(notifier, handlers, observableObserver);

    observe(absintheSocket, notifier, observer);

    return unsubscribe && getUnsubscriber(absintheSocket, notifier, observer, unsubscribe);
  });

export default toObservable;
