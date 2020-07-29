import isDeepEqual from "fast-deep-equal";
import {GqlRequest} from "./utils-graphql";
import handlePush from "./handlePush";
import {AbsintheEvent} from "./absinthe-event/types";
import {AbsintheSocket, NotifierPushHandler, PushHandler} from "./types";
import {Notifier} from "./notifier/types";

type Handler<R, V, T extends keyof PushHandler<unknown>> = (arg0: AbsintheSocket<R, V>, arg1: Notifier<R, V>) => PushHandler<R>[T];

const getPushHandlerMethodGetter = <R, V, T extends keyof PushHandler<unknown>>(
  absintheSocket: AbsintheSocket<R, V>,
  request: GqlRequest<V>
) => {
  return (handle: Handler<R, V, T>) => {
    const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.request, request));
    if (notifier) {
      return handle(absintheSocket, notifier);
    }
    return () => {};
  };
};

const getPushHandler = <R, V>(aSocket: AbsintheSocket<R, V>, request: GqlRequest<V>, npHandler: NotifierPushHandler): PushHandler<R> => {
  return {
    onError: getPushHandlerMethodGetter<R, V, "onError">(aSocket, request)(npHandler.onError),
    onSucceed: getPushHandlerMethodGetter<R, V, "onSucceed">(aSocket, request)(npHandler.onSucceed),
    onTimeout: getPushHandlerMethodGetter<R, V, "onTimeout">(aSocket, request)(npHandler.onTimeout),
  };
};

const pushAbsintheEvent = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  request: GqlRequest<V>,
  notifierPushHandler: NotifierPushHandler,
  absintheEvent: AbsintheEvent
): AbsintheSocket<R, V> => {
  handlePush(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler)
  );

  return absintheSocket;
};

export default pushAbsintheEvent;
