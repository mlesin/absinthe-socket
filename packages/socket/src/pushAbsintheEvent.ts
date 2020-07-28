import {map} from "@jumpn/utils-composite";

import {GqlRequest} from "./gql";

import handlePush from "./handlePush";
import notifierFind from "./notifier/find";

import {AbsintheEvent} from "./absinthe-event/types";
import {AbsintheSocket, NotifierPushHandler} from "./types";

const getPushHandlerMethodGetter = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, request) => (handle) => (
  ...args
) => {
  const notifier = notifierFind(absintheSocket.notifiers, "request", request);

  if (notifier) {
    handle(absintheSocket, notifier, ...args);
  }
};

const getPushHandler = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, request, notifierPushHandler) =>
  map(getPushHandlerMethodGetter(absintheSocket, request), notifierPushHandler);

const pushAbsintheEvent = <Result, Variables, Response>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  request: GqlRequest<Variables>,
  notifierPushHandler: NotifierPushHandler<Response>,
  absintheEvent: AbsintheEvent
): AbsintheSocket<Result, Variables> => {
  handlePush(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler)
  );

  return absintheSocket;
};

export default pushAbsintheEvent;
