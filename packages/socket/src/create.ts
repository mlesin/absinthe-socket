import {Socket as PhoenixSocket, Message} from "phoenix";

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

const onMessage = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>) => (message: Message<>) => {
  if (withSubscription.isDataMessage(message)) {
    withSubscription.onDataMessage(absintheSocket, message);
  }
};

const createConnectionCloseError = () => new Error("connection: close");

const notifyConnectionCloseError = <Result, Variables>(notifier: Notifier<Result, Variables>) =>
  notifierNotify(notifier, createErrorEvent(createConnectionCloseError()));

const notifierOnConnectionCloseCanceled = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) => updateNotifiers(absintheSocket, notifierRemove(notifyConnectionCloseError(notifier)));

const notifierOnConnectionCloseActive = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) => {
  if (notifier.operationType === "mutation") {
    abortNotifier(absintheSocket, notifier, createConnectionCloseError());
  } else {
    refreshNotifier(absintheSocket, notifierReset(notifyConnectionCloseError(notifier)));
  }
};

const notifierOnConnectionClose = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>) => (
  notifier: Notifier<Result, Variables>
) => {
  if (notifier.isActive) {
    notifierOnConnectionCloseActive(absintheSocket, notifier);
  } else {
    notifierOnConnectionCloseCanceled(absintheSocket, notifier);
  }
};

const onConnectionClose = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>) => () =>
  absintheSocket.notifiers.forEach(notifierOnConnectionClose(absintheSocket));

const shouldJoinChannel = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>) =>
  !absintheSocket.channelJoinCreated && absintheSocket.notifiers.length > 0;

const onConnectionOpen = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>) => () => {
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
const create = <Result, Variables>(phoenixSocket: PhoenixSocket): AbsintheSocket<Result, Variables> => {
  const absintheSocket: AbsintheSocket<Result, Variables> = {
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
