import {Socket as PhoenixSocket} from "phoenix";
import {Message} from "./phoenix";
import abortNotifier from "./abortNotifier";
import joinChannel from "./joinChannel";
import notifierNotify from "./notifier/notify";
import notifierRemove from "./notifier/remove";
import notifierReset from "./notifier/reset";
import refreshNotifier from "./refreshNotifier";
import updateNotifiers from "./updateNotifiers";
import * as withSubscription from "./subscription";
import {createErrorEvent} from "./notifier/event/eventCreators";

import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

const onMessage = <R, V>(absintheSocket: AbsintheSocket<R, V>) => (message: Message<withSubscription.SubscriptionPayload<R>>) => {
  if (withSubscription.isDataMessage(message)) {
    withSubscription.onDataMessage(absintheSocket, message);
  }
};

const createConnectionCloseError = () => new Error("connection: close");

const notifyConnectionCloseError = <R, V>(notifier: Notifier<R, V>) =>
  notifierNotify(notifier, createErrorEvent(createConnectionCloseError()));

const notifierOnConnectionCloseCanceled = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  updateNotifiers(absintheSocket, notifierRemove(notifyConnectionCloseError(notifier)));

const notifierOnConnectionCloseActive = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) => {
  if (notifier.operationType === "mutation") {
    abortNotifier(absintheSocket, notifier, createConnectionCloseError());
  } else {
    refreshNotifier(absintheSocket, notifierReset(notifyConnectionCloseError(notifier)));
  }
};

const notifierOnConnectionClose = <R, V>(absintheSocket: AbsintheSocket<R, V>) => (notifier: Notifier<R, V>) => {
  if (notifier.isActive) {
    notifierOnConnectionCloseActive(absintheSocket, notifier);
  } else {
    notifierOnConnectionCloseCanceled(absintheSocket, notifier);
  }
};

const onConnectionClose = <R, V>(absintheSocket: AbsintheSocket<R, V>) => () =>
  absintheSocket.notifiers.forEach(notifierOnConnectionClose(absintheSocket));

const shouldJoinChannel = <R, V>(absintheSocket: AbsintheSocket<R, V>) =>
  !absintheSocket.channelJoinCreated && absintheSocket.notifiers.length > 0;

const onConnectionOpen = <R, V>(absintheSocket: AbsintheSocket<R, V>) => () => {
  if (shouldJoinChannel(absintheSocket)) {
    joinChannel(absintheSocket);
  }
};

const absintheChannelName = "__absinthe__:control";

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
const create = <R, V>(phoenixSocket: PhoenixSocket): AbsintheSocket<R, V> => {
  const absintheSocket: AbsintheSocket<R, V> = {
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
