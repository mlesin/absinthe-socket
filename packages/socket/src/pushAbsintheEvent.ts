import {map} from "@jumpn/utils-composite";

import {GqlRequest} from "@jumpn/utils-graphql/compat/cjs/types";

import handlePush from "./handlePush";
import notifierFind from "./notifier/find";

import {AbsintheEvent} from "./absinthe-event/types";
import {AbsintheSocket, NotifierPushHandler} from "./types";

const getPushHandlerMethodGetter = (absintheSocket, request) => (handle) => (...args) => {
  const notifier = notifierFind(absintheSocket.notifiers, "request", request);

  if (notifier) {
    handle(absintheSocket, notifier, ...args);
  }
};

const getPushHandler = (absintheSocket, request, notifierPushHandler) =>
  map(getPushHandlerMethodGetter(absintheSocket, request), notifierPushHandler);

const pushAbsintheEvent = <Variables extends void | Object, Response extends Object>(
  absintheSocket: AbsintheSocket,
  request: GqlRequest<Variables>,
  notifierPushHandler: NotifierPushHandler<Response>,
  absintheEvent: AbsintheEvent
) => {
  handlePush(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler)
  );

  return absintheSocket;
};

export default pushAbsintheEvent;
