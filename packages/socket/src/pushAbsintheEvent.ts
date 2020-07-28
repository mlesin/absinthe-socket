// import {map} from "@jumpn/utils-composite";
import isDeepEqual from "fast-deep-equal";
import {GqlRequest} from "./utils-graphql";
import handlePush from "./handlePush";
// import notifierFind from "./notifier/find";
import {AbsintheEvent} from "./absinthe-event/types";
import {AbsintheSocket, NotifierPushHandler} from "./types";
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

const getPushHandler = <Result, Variables, Response>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  request: GqlRequest<Variables>,
  notifierPushHandler: NotifierPushHandler<Response>
): NotifierPushHandler<Response> => {
  return {
    ...notifierPushHandler,
    onError: getPushHandlerMethodGetter(
      absintheSocket,
      request
    )(<R, V>(asckt: AbsintheSocket<R, V>, ntf: Notifier<R, V>, ...args: unknown[]) => {
      console.log(asckt, ntf, args); // FIXME FIXME FIXME!!!
    }),
  };
};
// map(getPushHandlerMethodGetter(absintheSocket, request), notifierPushHandler);

const pushAbsintheEvent = <Result, Variables, Response>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  request: GqlRequest<Variables>,
  notifierPushHandler: NotifierPushHandler<Response>,
  absintheEvent: AbsintheEvent
): AbsintheSocket<Result, Variables> => {
  handlePush<Response>(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler)
  );

  return absintheSocket;
};

export default pushAbsintheEvent;
