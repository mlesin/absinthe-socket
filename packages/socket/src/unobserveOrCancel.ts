import cancel from './cancel';
import unobserve from './unobserve';

import { AbsintheSocket } from './types';
import { Notifier, Observer } from './notifier/types';

const doUnobserveOrCancel = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier,
  observer: Observer,
) =>
  notifier.activeObservers.length === 1
    ? cancel(absintheSocket, notifier)
    : unobserve(absintheSocket, notifier, observer);

/**
 * Cancels notifier if there are no more observers apart from the one given, or
 * detaches given observer from notifier otherwise
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */
const unobserveOrCancel = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier,
  observer: Observer,
): AbsintheSocket =>
  notifier.isActive ? doUnobserveOrCancel(absintheSocket, notifier, observer) : absintheSocket;

export default unobserveOrCancel;
