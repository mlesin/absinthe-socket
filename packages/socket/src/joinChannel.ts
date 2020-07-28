import handlePush from "./handlePush";
import notifierNotifyActive from "./notifier/notifyActive";
import pushRequest from "./pushRequest";
import {createErrorEvent} from "./notifier/event/eventCreators";

import {AbsintheSocket} from "./types";

const createChannelJoinError = (message: string) => new Error(`channel join: ${message}`);

const notifyErrorToAllActive = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, errorMessage: string) =>
  absintheSocket.notifiers.forEach((notifier) => notifierNotifyActive(notifier, createErrorEvent(createChannelJoinError(errorMessage))));

// join Push is reused and so the handler
// https://github.com/phoenixframework/phoenix/blob/master/assets/js/phoenix.js#L356
const createChannelJoinHandler = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>) => ({
  onError: (errorMessage: string) => notifyErrorToAllActive(absintheSocket, errorMessage),

  onSucceed: () => absintheSocket.notifiers.forEach((notifier) => pushRequest(absintheSocket, notifier)),

  onTimeout: () => notifyErrorToAllActive(absintheSocket, "timeout"),
});

const joinChannel = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>): AbsintheSocket<Result, Variables> => {
  handlePush(absintheSocket.channel.join(), createChannelJoinHandler(absintheSocket));

  absintheSocket.channelJoinCreated = true;

  return absintheSocket;
};

export default joinChannel;
