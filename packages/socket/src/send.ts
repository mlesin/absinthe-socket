import isDeepEqual from 'fast-deep-equal';
import { arrayAppend } from './utils-array';
import { GqlRequest } from './utils-graphql';
import joinChannel from './joinChannel';
import notifierCreate from './notifier/create';
import notifierFlushCanceled from './notifier/flushCanceled';
import notifierReactivate from './notifier/reactivate';
import pushRequest from './pushRequest';
import refreshNotifier from './refreshNotifier';
import requestStatuses from './notifier/requestStatuses';
import updateNotifiers from './updateNotifiers';

import { AbsintheSocket } from './types';
import { Notifier } from './notifier/types';

const connectOrJoinChannel = (absintheSocket: AbsintheSocket) => {
  if (absintheSocket.phoenixSocket.isConnected()) {
    joinChannel(absintheSocket);
  } else {
    // socket ignores connect calls if a connection has already been created
    absintheSocket.phoenixSocket.connect();
  }
};

const sendNew = <V>(absintheSocket: AbsintheSocket, request: GqlRequest<V>) => {
  const notifier = notifierCreate<V>(request);

  updateNotifiers(absintheSocket, arrayAppend([notifier]));

  if (absintheSocket.channelJoinCreated) {
    pushRequest(absintheSocket, notifier);
  } else {
    connectOrJoinChannel(absintheSocket);
  }

  return notifier;
};

const updateCanceledReactivate = (absintheSocket: AbsintheSocket, notifier: Notifier) =>
  refreshNotifier(absintheSocket, notifierReactivate(notifier));

const updateCanceled = (absintheSocket: AbsintheSocket, notifier: Notifier) =>
  notifier.requestStatus === requestStatuses.sending
    ? updateCanceledReactivate(absintheSocket, notifierFlushCanceled(notifier))
    : updateCanceledReactivate(absintheSocket, notifier);

const updateIfCanceled = (absintheSocket: AbsintheSocket, notifier: Notifier) =>
  notifier.isActive ? notifier : updateCanceled(absintheSocket, notifier);

const getExistentIfAny = <V>(absintheSocket: AbsintheSocket, request: GqlRequest<V>) => {
  const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.request, request));
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
const send = <V>(absintheSocket: AbsintheSocket, request: GqlRequest<V>): Notifier =>
  getExistentIfAny(absintheSocket, request) || sendNew(absintheSocket, request);

export default send;
