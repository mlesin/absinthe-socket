import { requestToCompat } from './utils-graphql';
import abortNotifier from './abortNotifier';
import notifierNotifyActive from './notifier/notifyActive';
import pushAbsintheEvent from './pushAbsintheEvent';
import refreshNotifier from './refreshNotifier';
import requestStatuses from './notifier/requestStatuses';
import { createAbsintheDocEvent } from './absinthe-event/absintheEventCreators';
import { createErrorEvent } from './notifier/event/eventCreators';
import { AbsintheSocket, NotifierPushHandler } from './types';
import { Notifier } from './notifier/types';

const pushAbsintheDocEvent = (absintheSocket: AbsintheSocket, { request }: Notifier, notifierPushHandler: NotifierPushHandler) =>
  pushAbsintheEvent(absintheSocket, request, notifierPushHandler, createAbsintheDocEvent(requestToCompat(request)));

const setNotifierRequestStatusSending = (absintheSocket: AbsintheSocket, notifier: Notifier) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sending,
  });

const createRequestError = (message: string) => new Error(`request: ${message}`);

const onTimeout = (_absintheSocket: AbsintheSocket, notifier: Notifier) => () =>
  notifierNotifyActive(notifier, createErrorEvent(createRequestError('timeout')));

const onError = (absintheSocket: AbsintheSocket, notifier: Notifier) => (errorMessage: string): AbsintheSocket =>
  abortNotifier(absintheSocket, notifier, createRequestError(errorMessage));

const getNotifierPushHandler = (onSucceed: NotifierPushHandler['onSucceed']): NotifierPushHandler => ({
  onError,
  onSucceed,
  onTimeout,
});

const pushRequestUsing = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier,
  onSucceed: NotifierPushHandler['onSucceed'],
): AbsintheSocket =>
  pushAbsintheDocEvent(absintheSocket, setNotifierRequestStatusSending(absintheSocket, notifier), getNotifierPushHandler(onSucceed));

export { pushRequestUsing as default, onError };
