import notifierRefresh from "./notifier/refresh";
import notifierUnobserve from "./notifier/unobserve";
import updateNotifiers from "./updateNotifiers";

import {AbsintheSocket} from "./types";
import {Notifier, Observer} from "./notifier/types";

const ensureHasActiveObserver = <Result, Variables>(notifier: Notifier<Result, Variables>, observer: Observer<Result, Variables>) => {
  if (notifier.activeObservers.includes(observer)) return notifier;

  throw new Error("Observer is not attached to notifier");
};

/**
 * Detaches observer from notifier
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */
const unobserve = <Result, Variables>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>
): AbsintheSocket =>
  updateNotifiers(absintheSocket, notifierRefresh(notifierUnobserve(ensureHasActiveObserver(notifier, observer), observer)));

export default unobserve;
