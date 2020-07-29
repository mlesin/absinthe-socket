import notifierRefresh from "./notifier/refresh";
import notifierUnobserve from "./notifier/unobserve";
import updateNotifiers from "./updateNotifiers";

import {AbsintheSocket} from "./types";
import {Notifier, Observer} from "./notifier/types";

const ensureHasActiveObserver = <R, V>(notifier: Notifier<R, V>, observer: Observer<R, V>) => {
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
const unobserve = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>, observer: Observer<R, V>): AbsintheSocket<R, V> =>
  updateNotifiers(absintheSocket, notifierRefresh(notifierUnobserve(ensureHasActiveObserver(notifier, observer), observer)));

export default unobserve;
