import notifierCancel from "./notifier/cancel";
import notifierFlushCanceled from "./notifier/flushCanceled";
import notifierRefresh from "./notifier/refresh";
import notifierRemove from "./notifier/remove";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";
import {unsubscribe} from "./subscription";

import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

const cancelQueryOrMutationSending = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  updateNotifiers(absintheSocket, notifierRefresh(notifierFlushCanceled(notifierCancel(notifier))));

const cancelQueryOrMutationIfSending = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  notifier.requestStatus === requestStatuses.sending ? cancelQueryOrMutationSending(absintheSocket, notifier) : absintheSocket;

const cancelPending = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  updateNotifiers(absintheSocket, notifierRemove(notifierFlushCanceled(notifierCancel(notifier))));

const cancelQueryOrMutation = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  notifier.requestStatus === requestStatuses.pending
    ? cancelPending(absintheSocket, notifier)
    : cancelQueryOrMutationIfSending(absintheSocket, notifier);

const unsubscribeIfNeeded = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  notifier.requestStatus === requestStatuses.sent ? unsubscribe(absintheSocket, notifier) : absintheSocket;

const cancelNonPendingSubscription = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  unsubscribeIfNeeded(absintheSocket, refreshNotifier(absintheSocket, notifierCancel(notifier)));

const cancelSubscription = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  notifier.requestStatus === requestStatuses.pending
    ? cancelPending(absintheSocket, notifier)
    : cancelNonPendingSubscription(absintheSocket, notifier);

const cancelActive = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  notifier.operationType === "subscription"
    ? cancelSubscription(absintheSocket, notifier)
    : cancelQueryOrMutation(absintheSocket, notifier);

/** : AbsintheSocket
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.cancel(absintheSocket, notifier);
 */
const cancel = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>): AbsintheSocket<R, V> =>
  notifier.isActive ? cancelActive(absintheSocket, notifier) : absintheSocket;

export default cancel;
