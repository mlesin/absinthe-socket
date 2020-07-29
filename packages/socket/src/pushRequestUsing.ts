import {requestToCompat, GqlResponse} from "./utils-graphql";
import abortNotifier from "./abortNotifier";
import notifierNotifyActive from "./notifier/notifyActive";
import pushAbsintheEvent from "./pushAbsintheEvent";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import {createAbsintheDocEvent} from "./absinthe-event/absintheEventCreators";
import {createErrorEvent} from "./notifier/event/eventCreators";

import {AbsintheSocket, NotifierPushHandler} from "./types";
import {Notifier} from "./notifier/types";

type $ElementType<T extends {[P in K & unknown]: unknown}, K extends keyof T | number> = T[K];

const pushAbsintheDocEvent = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  {request}: Notifier<Result, Variables>,
  notifierPushHandler: NotifierPushHandler
) => pushAbsintheEvent(absintheSocket, request, notifierPushHandler, createAbsintheDocEvent(requestToCompat(request)));

const setNotifierRequestStatusSending = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sending,
  });

const createRequestError = (message: string) => new Error(`request: ${message}`);

const onTimeout = <Result, Variables>(_absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) =>
  notifierNotifyActive(notifier, createErrorEvent(createRequestError("timeout")));

const onError = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>,
  errorMessage: string
): AbsintheSocket<Result, Variables> => abortNotifier(absintheSocket, notifier, createRequestError(errorMessage));

const getNotifierPushHandler = <Result>(onSucceed: NotifierPushHandler["onSucceed"]): NotifierPushHandler => ({
  onError,
  onSucceed,
  onTimeout,
});

const pushRequestUsing = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>,
  onSucceed: $ElementType<NotifierPushHandler, "onSucceed">
): AbsintheSocket<Result, Variables> =>
  pushAbsintheDocEvent(absintheSocket, setNotifierRequestStatusSending(absintheSocket, notifier), getNotifierPushHandler(onSucceed));

export {pushRequestUsing as default, onError};
