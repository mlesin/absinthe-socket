import notifierObserve from "./notifier/observe";
import refreshNotifier from "./refreshNotifier";

import {AbsintheSocket} from "./types";
import {Notifier, Observer} from "./notifier/types";

/**
 * Observes given notifier using the provided observer
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket"
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const updatedNotifier = withAbsintheSocket.observe(absintheSocket, notifier, {
 *   onAbort: logEvent("abort"),
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   onResult: logEvent("result")
 * });
 */
const observe = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>
): Notifier<Result, Variables> => refreshNotifier(absintheSocket, notifierObserve(notifier, observer));

export default observe;
