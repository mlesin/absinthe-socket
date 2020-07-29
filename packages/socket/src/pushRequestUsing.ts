import {requestToCompat} from "./utils-graphql";
import abortNotifier from "./abortNotifier";
import notifierNotifyActive from "./notifier/notifyActive";
import pushAbsintheEvent from "./pushAbsintheEvent";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import {createAbsintheDocEvent} from "./absinthe-event/absintheEventCreators";
import {createErrorEvent} from "./notifier/event/eventCreators";
import {AbsintheSocket, NotifierPushHandler} from "./types";
import {Notifier} from "./notifier/types";

const pushAbsintheDocEvent = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  {request}: Notifier<R, V>,
  notifierPushHandler: NotifierPushHandler
) => pushAbsintheEvent(absintheSocket, request, notifierPushHandler, createAbsintheDocEvent(requestToCompat(request)));

const setNotifierRequestStatusSending = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sending,
  });

const createRequestError = (message: string) => new Error(`request: ${message}`);

const onTimeout = <R, V>(_absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) => () =>
  notifierNotifyActive(notifier, createErrorEvent(createRequestError("timeout")));

const onError = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) => (errorMessage: string): AbsintheSocket<R, V> =>
  abortNotifier(absintheSocket, notifier, createRequestError(errorMessage));

const getNotifierPushHandler = (onSucceed: NotifierPushHandler["onSucceed"]): NotifierPushHandler => ({
  onError,
  onSucceed,
  onTimeout,
});

const pushRequestUsing = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  notifier: Notifier<R, V>,
  onSucceed: NotifierPushHandler["onSucceed"]
): AbsintheSocket<R, V> =>
  pushAbsintheDocEvent(absintheSocket, setNotifierRequestStatusSending(absintheSocket, notifier), getNotifierPushHandler(onSucceed));

export {pushRequestUsing as default, onError};
