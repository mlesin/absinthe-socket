import isDeepEqual from 'fast-deep-equal';
import { Message } from './phoenix';
import { gqlErrorsToString, GqlError, GqlResponse } from './utils-graphql';
import abortNotifier from './abortNotifier';
import notifierFlushCanceled from './notifier/flushCanceled';
import notifierNotifyCanceled from './notifier/notifyCanceled';
import notifierNotifyResultEvent from './notifier/notifyResultEvent';
import notifierNotifyStartEvent from './notifier/notifyStartEvent';
import notifierRemove from './notifier/remove';
import notifierReset from './notifier/reset';
import pushAbsintheEvent from './pushAbsintheEvent';
import pushRequestUsing, { onError } from './pushRequestUsing';
import refreshNotifier from './refreshNotifier';
import requestStatuses from './notifier/requestStatuses';
import updateNotifiers from './updateNotifiers';
import { createAbsintheUnsubscribeEvent } from './absinthe-event/absintheEventCreators';
import { createErrorEvent } from './notifier/event/eventCreators';

import { AbsintheSocket, NotifierPushHandler } from './types';
import { Notifier } from './notifier/types';

export interface SubscriptionPayload {
  result: GqlResponse;
  subscriptionId: string;
}

// TODO: improve this type
type UnsubscribeResponse = void;

type SubscriptionResponse = { subscriptionId?: string; errors?: Array<GqlError> };

const createUnsubscribeError = (message: string) => new Error(`unsubscribe: ${message}`);

const dataMessageEventName = 'subscription:data';

export const isDataMessage = (message: Message<unknown>): boolean => message.event === dataMessageEventName;

const onUnsubscribeSucceedCanceled = (absintheSocket: AbsintheSocket, notifier: Notifier) =>
  updateNotifiers(absintheSocket, notifierRemove(notifierFlushCanceled(notifier)));

const onSubscribeSucceed = (absintheSocket: AbsintheSocket, notifier: Notifier) => (subscriptionId: string) => {
  const subscribedNotifier = refreshNotifier(absintheSocket, {
    ...notifier,
    subscriptionId,
    requestStatus: requestStatuses.sent,
  });

  if (subscribedNotifier.isActive) {
    notifierNotifyStartEvent(subscribedNotifier);
  } else {
    unsubscribe(absintheSocket, subscribedNotifier);
  }
};

const onSubscribe = (absintheSocket: AbsintheSocket, notifier: Notifier) => (response: SubscriptionResponse) => {
  if (response.errors) {
    onError(absintheSocket, notifier)(gqlErrorsToString(response.errors));
  } else if (response.subscriptionId) {
    onSubscribeSucceed(absintheSocket, notifier)(response.subscriptionId);
  }
};

const onUnsubscribeSucceedActive = (absintheSocket: AbsintheSocket, notifier: Notifier) =>
  subscribe(absintheSocket, refreshNotifier(absintheSocket, notifierReset(notifier)));

const unsubscribeHandler: NotifierPushHandler = {
  onError: (absintheSocket, notifier) => (errorMessage) => abortNotifier(absintheSocket, notifier, createUnsubscribeError(errorMessage)),
  onTimeout: (_absintheSocket, notifier) => () => notifierNotifyCanceled(notifier, createErrorEvent(createUnsubscribeError('timeout'))),
  onSucceed: (absintheSocket, notifier) => () => {
    if (notifier.isActive) {
      onUnsubscribeSucceedActive(absintheSocket, notifier);
    } else {
      onUnsubscribeSucceedCanceled(absintheSocket, notifier);
    }
  },
};

const pushAbsintheUnsubscribeEvent = (absintheSocket: AbsintheSocket, { request, subscriptionId }: Notifier): AbsintheSocket =>
  pushAbsintheEvent(absintheSocket, request, unsubscribeHandler, createAbsintheUnsubscribeEvent({ subscriptionId }));

export const onDataMessage = (absintheSocket: AbsintheSocket, { payload }: Message<SubscriptionPayload>): void => {
  const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.subscriptionId, payload.subscriptionId));

  if (notifier) {
    notifierNotifyResultEvent(notifier, payload.result.data);
  }
};

export function subscribe(absintheSocket: AbsintheSocket, notifier: Notifier): AbsintheSocket {
  return pushRequestUsing(absintheSocket, notifier, onSubscribe);
}

export function unsubscribe(absintheSocket: AbsintheSocket, notifier: Notifier): AbsintheSocket {
  return pushAbsintheUnsubscribeEvent(
    absintheSocket,
    refreshNotifier(absintheSocket, {
      ...notifier,
      requestStatus: 'canceling',
    }),
  );
}
