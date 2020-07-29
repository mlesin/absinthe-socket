import handlePush from "./handlePush";
import notifierNotifyActive from "./notifier/notifyActive";
import pushRequest from "./pushRequest";
import {createErrorEvent} from "./notifier/event/eventCreators";
import {AbsintheSocket} from "./types";

const createChannelJoinError = (message: string) => new Error(`channel join: ${message}`);

const notifyErrorToAllActive = <R, V>(absintheSocket: AbsintheSocket<R, V>, errorMessage: string) =>
  absintheSocket.notifiers.forEach((notifier) => notifierNotifyActive(notifier, createErrorEvent(createChannelJoinError(errorMessage))));

// join Push is reused and so the handler
// https://github.com/phoenixframework/phoenix/blob/master/assets/js/phoenix.js#L356
const createChannelJoinHandler = <R, V>(absintheSocket: AbsintheSocket<R, V>) => ({
  onError: (errorMessage: string) => notifyErrorToAllActive(absintheSocket, errorMessage),

  onSucceed: () => absintheSocket.notifiers.forEach((notifier) => pushRequest(absintheSocket, notifier)),

  onTimeout: () => notifyErrorToAllActive(absintheSocket, "timeout"),
});

const joinChannel = <R, V>(absintheSocket: AbsintheSocket<R, V>): AbsintheSocket<R, V> => {
  handlePush(absintheSocket.channel.join(), createChannelJoinHandler(absintheSocket));

  absintheSocket.channelJoinCreated = true;

  return absintheSocket;
};

export default joinChannel;
