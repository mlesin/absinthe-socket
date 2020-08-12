import { Socket as PhoenixSocket } from 'phoenix';
import { Message } from './phoenix';
import abortNotifier from './abortNotifier';
import joinChannel from './joinChannel';
import notifierNotify from './notifier/notify';
import notifierRemove from './notifier/remove';
import notifierReset from './notifier/reset';
import refreshNotifier from './refreshNotifier';
import updateNotifiers from './updateNotifiers';
import * as withSubscription from './subscription';
import { createErrorEvent } from './notifier/event/eventCreators';

import { AbsintheSocket } from './types';
import { Notifier } from './notifier/types';

const onMessage = (absintheSocket: AbsintheSocket) => (
  message: Message<withSubscription.SubscriptionPayload>,
) => {
  if (withSubscription.isDataMessage(message)) {
    withSubscription.onDataMessage(absintheSocket, message);
  }
};

const createConnectionCloseError = () => new Error('connection: close');

const notifyConnectionCloseError = (notifier: Notifier) =>
  notifierNotify(notifier, createErrorEvent(createConnectionCloseError()));

const notifierOnConnectionCloseCanceled = (absintheSocket: AbsintheSocket, notifier: Notifier) =>
  updateNotifiers(absintheSocket, notifierRemove(notifyConnectionCloseError(notifier)));

const notifierOnConnectionCloseActive = (absintheSocket: AbsintheSocket, notifier: Notifier) => {
  if (notifier.operationType === 'mutation') {
    abortNotifier(absintheSocket, notifier, createConnectionCloseError());
  } else {
    refreshNotifier(absintheSocket, notifierReset(notifyConnectionCloseError(notifier)));
  }
};

const notifierOnConnectionClose = (absintheSocket: AbsintheSocket) => (notifier: Notifier) => {
  if (notifier.isActive) {
    notifierOnConnectionCloseActive(absintheSocket, notifier);
  } else {
    notifierOnConnectionCloseCanceled(absintheSocket, notifier);
  }
};

const onConnectionClose = (absintheSocket: AbsintheSocket) => () =>
  absintheSocket.notifiers.forEach(notifierOnConnectionClose(absintheSocket));

const shouldJoinChannel = (absintheSocket: AbsintheSocket) =>
  !absintheSocket.channelJoinCreated && absintheSocket.notifiers.length > 0;

const onConnectionOpen = (absintheSocket: AbsintheSocket) => () => {
  if (shouldJoinChannel(absintheSocket)) {
    joinChannel(absintheSocket);
  }
};

const absintheChannelName = '__absinthe__:control';

/**
 * Creates an Absinthe Socket using the given Phoenix Socket instance
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 * import {Socket as PhoenixSocket} from "phoenix";

 * const absintheSocket = withAbsintheSocket.create(
 *   new PhoenixSocket("ws://localhost:4000/socket")
 * );
 */
const create = (phoenixSocket: PhoenixSocket): AbsintheSocket => {
  const absintheSocket: AbsintheSocket = {
    phoenixSocket,
    channel: phoenixSocket.channel(absintheChannelName),
    channelJoinCreated: false,
    notifiers: [],
  };

  phoenixSocket.onOpen(onConnectionOpen(absintheSocket));
  phoenixSocket.onClose(onConnectionClose(absintheSocket));
  phoenixSocket.onMessage(onMessage(absintheSocket));

  return absintheSocket;
};

export default create;
