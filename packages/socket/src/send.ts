import {append} from "@jumpn/utils-array";

import {GqlRequest} from "./gql";

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

const connectOrJoinChannel = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>) => {
  if (absintheSocket.phoenixSocket.isConnected()) {
    joinChannel(absintheSocket);
  } else {
    // socket ignores connect calls if a connection has already been created
    absintheSocket.phoenixSocket.connect();
  }
};

const sendNew = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, request) => {
  const notifier = notifierCreate(request);

  updateNotifiers(absintheSocket, append([notifier]));

  if (absintheSocket.channelJoinCreated) {
    pushRequest(absintheSocket, notifier);
  } else {
    connectOrJoinChannel(absintheSocket);
  }

  return notifier;
};

const updateCanceledReactivate = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) => refreshNotifier(absintheSocket, notifierReactivate(notifier));

const updateCanceled = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) =>
  notifier.requestStatus === requestStatuses.sending
    ? updateCanceledReactivate(absintheSocket, notifierFlushCanceled(notifier))
    : updateCanceledReactivate(absintheSocket, notifier);

const updateIfCanceled = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) =>
  notifier.isActive ? notifier : updateCanceled(absintheSocket, notifier);

const getExistentIfAny = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, request) => {
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
const send = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  request: GqlRequest<Variables>
): Notifier<Result, Variables> => getExistentIfAny(absintheSocket, request) || sendNew(absintheSocket, request);

export default send;
