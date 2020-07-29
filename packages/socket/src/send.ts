import {append} from "@jumpn/utils-array";
import {GqlRequest} from "./utils-graphql";
import joinChannel from "./joinChannel";
import notifierCreate from "./notifier/create";
import notifierFind from "./notifier/find";
import notifierFlushCanceled from "./notifier/flushCanceled";
import notifierReactivate from "./notifier/reactivate";
import pushRequest from "./pushRequest";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";

import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

const connectOrJoinChannel = <R, V>(absintheSocket: AbsintheSocket<R, V>) => {
  if (absintheSocket.phoenixSocket.isConnected()) {
    joinChannel(absintheSocket);
  } else {
    // socket ignores connect calls if a connection has already been created
    absintheSocket.phoenixSocket.connect();
  }
};

const sendNew = <R, V>(absintheSocket: AbsintheSocket<R, V>, request: GqlRequest<V>) => {
  const notifier = notifierCreate<R, V>(request);

  updateNotifiers(absintheSocket, append([notifier]));

  if (absintheSocket.channelJoinCreated) {
    pushRequest(absintheSocket, notifier);
  } else {
    connectOrJoinChannel(absintheSocket);
  }

  return notifier;
};

const updateCanceledReactivate = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  refreshNotifier(absintheSocket, notifierReactivate(notifier));

const updateCanceled = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  notifier.requestStatus === requestStatuses.sending
    ? updateCanceledReactivate(absintheSocket, notifierFlushCanceled(notifier))
    : updateCanceledReactivate(absintheSocket, notifier);

const updateIfCanceled = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  notifier.isActive ? notifier : updateCanceled(absintheSocket, notifier);

const getExistentIfAny = <R, V>(absintheSocket: AbsintheSocket<R, V>, request: GqlRequest<V>) => {
  const notifier = notifierFind(absintheSocket.notifiers, "request", request);

  return notifier && updateIfCanceled(absintheSocket, notifier);
};

/**
 * Sends given request and returns an object (notifier) to track its progress
 * (see observe function)
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * const operation = `
 *   subscription userSubscription($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * // This example uses a subscription, but the functionallity is the same for
 * // all operation types (queries, mutations and subscriptions)
 *
 * const notifier = withAbsintheSocket.send(absintheSocket, {
 *   operation,
 *   variables: {userId: 10}
 * });
 */
const send = <R, V>(absintheSocket: AbsintheSocket<R, V>, request: GqlRequest<V>): Notifier<R, V> =>
  getExistentIfAny(absintheSocket, request) || sendNew(absintheSocket, request);

export default send;
