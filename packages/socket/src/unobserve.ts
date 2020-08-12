import notifierRefresh from './notifier/refresh';
import notifierUnobserve from './notifier/unobserve';
import updateNotifiers from './updateNotifiers';

import { AbsintheSocket } from './types';
import { Notifier, Observer } from './notifier/types';

const ensureHasActiveObserver = (notifier: Notifier, observer: Observer) => {
  if (notifier.activeObservers.includes(observer)) return notifier;

  throw new Error('Observer is not attached to notifier');
};

/**
 * Detaches observer from notifier
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */
const unobserve = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier,
  observer: Observer,
): AbsintheSocket =>
  updateNotifiers(
    absintheSocket,
    notifierRefresh(notifierUnobserve(ensureHasActiveObserver(notifier, observer), observer)),
  );

export default unobserve;
