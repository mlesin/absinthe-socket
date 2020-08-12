import isDeepEqual from 'fast-deep-equal';
import { GqlRequest } from './utils-graphql';
import handlePush from './handlePush';
import { AbsintheEvent } from './absinthe-event/types';
import { AbsintheSocket, NotifierPushHandler, PushHandler } from './types';
import { Notifier } from './notifier/types';

type Handler<T extends keyof PushHandler> = (
  arg0: AbsintheSocket,
  arg1: Notifier,
) => PushHandler[T];

const getPushHandlerMethodGetter = <T extends keyof PushHandler>(
  absintheSocket: AbsintheSocket,
  request: GqlRequest<unknown>,
) => {
  return (handle: Handler<T>) => {
    const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.request, request));
    if (notifier) {
      return handle(absintheSocket, notifier);
    }
    return () => {
      return 0;
    };
  };
};

const getPushHandler = (
  aSocket: AbsintheSocket,
  request: GqlRequest<unknown>,
  npHandler: NotifierPushHandler,
): PushHandler => {
  return {
    onError: getPushHandlerMethodGetter<'onError'>(aSocket, request)(npHandler.onError),
    onSucceed: getPushHandlerMethodGetter<'onSucceed'>(aSocket, request)(npHandler.onSucceed),
    onTimeout: getPushHandlerMethodGetter<'onTimeout'>(aSocket, request)(npHandler.onTimeout),
  };
};

const pushAbsintheEvent = <V>(
  absintheSocket: AbsintheSocket,
  request: GqlRequest<V>,
  notifierPushHandler: NotifierPushHandler,
  absintheEvent: AbsintheEvent,
): AbsintheSocket => {
  handlePush(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler),
  );

  return absintheSocket;
};

export default pushAbsintheEvent;
