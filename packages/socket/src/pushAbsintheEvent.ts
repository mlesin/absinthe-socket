// import {map} from "@jumpn/utils-composite";
import isDeepEqual from "fast-deep-equal";
import {GqlRequest, GqlResponse} from "./utils-graphql";
import handlePush from "./handlePush";
import {AbsintheEvent} from "./absinthe-event/types";
import {AbsintheSocket, NotifierPushHandler, PushHandler} from "./types";
import {Notifier} from "./notifier/types";

type Handler = <R, V>(arg0: AbsintheSocket<R, V>, arg1: Notifier<R, V>, ...args: unknown[]) => void;

const getPushHandlerMethodGetter = <R, V>(absintheSocket: AbsintheSocket<R, V>, request: GqlRequest<V>) => (handle: Handler) => (
  ...args: unknown[]
) => {
  const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.request, request));

  if (notifier) {
    handle(absintheSocket, notifier, ...args);
  }
};

const getPushHandler = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  request: GqlRequest<V>,
  notifierPushHandler: NotifierPushHandler
): PushHandler<R> => {
  return {
    ...notifierPushHandler,
    onError: getPushHandlerMethodGetter(absintheSocket, request)(notifierPushHandler.onError),
  };
};
// map(getPushHandlerMethodGetter(absintheSocket, request), notifierPushHandler);

const pushAbsintheEvent = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  request: GqlRequest<V>,
  notifierPushHandler: NotifierPushHandler,
  absintheEvent: AbsintheEvent
): AbsintheSocket<R, V> => {
  handlePush<GqlResponse<R>>(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler)
  );

  return absintheSocket;
};

export default pushAbsintheEvent;
