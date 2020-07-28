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

const cancelQueryOrMutationSending = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) => updateNotifiers(absintheSocket, notifierRefresh(notifierFlushCanceled(notifierCancel(notifier))));

const cancelQueryOrMutationIfSending = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) => (notifier.requestStatus === requestStatuses.sending ? cancelQueryOrMutationSending(absintheSocket, notifier) : absintheSocket);

const cancelPending = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) =>
  updateNotifiers(absintheSocket, notifierRemove(notifierFlushCanceled(notifierCancel(notifier))));

const cancelQueryOrMutation = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) =>
  notifier.requestStatus === requestStatuses.pending
    ? cancelPending(absintheSocket, notifier)
    : cancelQueryOrMutationIfSending(absintheSocket, notifier);

const unsubscribeIfNeeded = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) =>
  notifier.requestStatus === requestStatuses.sent ? unsubscribe(absintheSocket, notifier) : absintheSocket;

const cancelNonPendingSubscription = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) => unsubscribeIfNeeded(absintheSocket, refreshNotifier(absintheSocket, notifierCancel(notifier)));

const cancelSubscription = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) =>
  notifier.requestStatus === requestStatuses.pending
    ? cancelPending(absintheSocket, notifier)
    : cancelNonPendingSubscription(absintheSocket, notifier);

const cancelActive = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) =>
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
const cancel = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
): AbsintheSocket<Result, Variables> => (notifier.isActive ? cancelActive(absintheSocket, notifier) : absintheSocket);

export default cancel;
