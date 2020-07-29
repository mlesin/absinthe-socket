// import {map} from "@jumpn/utils-composite";
import isDeepEqual from "fast-deep-equal";
import {GqlRequest, GqlResponse} from "./utils-graphql";
import handlePush from "./handlePush";
import {AbsintheEvent} from "./absinthe-event/types";
import {AbsintheSocket, NotifierPushHandler, PushHandler} from "./types";
import {Notifier} from "./notifier/types";

type Handler = <Result, Variables>(arg0: AbsintheSocket<Result, Variables>, arg1: Notifier<Result, Variables>, ...args: unknown[]) => void;

const getPushHandlerMethodGetter = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  request: GqlRequest<Variables>
) => (handle: Handler) => (...args: unknown[]) => {
  const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.request, request));

  if (notifier) {
    handle(absintheSocket, notifier, ...args);
  }
};

const getPushHandler = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  request: GqlRequest<Variables>,
  notifierPushHandler: NotifierPushHandler
): PushHandler<Result> => {
  return {
    ...notifierPushHandler,
    onError: getPushHandlerMethodGetter(absintheSocket, request)(notifierPushHandler.onError),
  };
};
// map(getPushHandlerMethodGetter(absintheSocket, request), notifierPushHandler);

const pushAbsintheEvent = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  request: GqlRequest<Variables>,
  notifierPushHandler: NotifierPushHandler,
  absintheEvent: AbsintheEvent
): AbsintheSocket<Result, Variables> => {
  handlePush<GqlResponse<Result>>(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler)
  );

  return absintheSocket;
};

export default pushAbsintheEvent;
