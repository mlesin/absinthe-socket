import {$ElementType, $Shape} from "utility-types";

import Observable from "zen-observable";

import notifierFind from "./notifier/find";
import observe from "./observe";

import {AbsintheSocket} from "./types";
import {Notifier, Observer} from "./notifier/types";

type Options<Result, Variables> = {
  onError: $ElementType<Observer<Result, Variables>, "onError">;
  onStart: $ElementType<Observer<Result, Variables>, "onStart">;
  unsubscribe: (
    absintheSocket: AbsintheSocket<Result, Variables>,
    notifier?: Notifier<Result, Variables>,
    observer?: Observer<Result, Variables>
  ) => void;
};

const getUnsubscriber = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, {request}, observer, unsubscribe) => () => {
  const notifier = notifierFind(absintheSocket.notifiers, "request", request);

  unsubscribe(absintheSocket, notifier, notifier ? observer : undefined);
};

const onResult = ({operationType}, observableObserver) => (result) => {
  observableObserver.next(result);

  if (operationType !== "subscription") {
    observableObserver.complete();
  }
};

const createObserver = <Result, Variables>(notifier: Notifier<Result, Variables>, handlers, observableObserver) => ({
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
  {unsubscribe, ...handlers}: $Shape<Options<Result, Variables>> = {}
) =>
  new Observable((observableObserver) => {
    const observer = createObserver(notifier, handlers, observableObserver);

    observe(absintheSocket, notifier, observer);

    return unsubscribe && getUnsubscriber(absintheSocket, notifier, observer, unsubscribe);
  });

export default toObservable;
