import isDeepEqual from "fast-deep-equal";
import {Message} from "./phoenix";
import {gqlErrorsToString, GqlError, GqlResponse} from "./utils-graphql";
import abortNotifier from "./abortNotifier";
import notifierFlushCanceled from "./notifier/flushCanceled";
import notifierNotifyCanceled from "./notifier/notifyCanceled";
import notifierNotifyResultEvent from "./notifier/notifyResultEvent";
import notifierNotifyStartEvent from "./notifier/notifyStartEvent";
import notifierRemove from "./notifier/remove";
import notifierReset from "./notifier/reset";
import pushAbsintheEvent from "./pushAbsintheEvent";
import pushRequestUsing, {onError} from "./pushRequestUsing";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";
import {createAbsintheUnsubscribeEvent} from "./absinthe-event/absintheEventCreators";
import {createErrorEvent} from "./notifier/event/eventCreators";

import {AbsintheSocket, NotifierPushHandler} from "./types";
import {Notifier} from "./notifier/types";

type SubscriptionPayload<Data> = {
  result: GqlResponse<Data>;
  subscriptionId: string;
};

// TODO: improve this type
type UnsubscribeResponse = void;

type SubscriptionResponse = {subscriptionId: string} | {errors: Array<GqlError>};

const createUnsubscribeError = (message: string) => new Error(`unsubscribe: ${message}`);

const dataMessageEventName = "subscription:data";

const isDataMessage = (message: Message<unknown>): boolean => message.event === dataMessageEventName;

const onUnsubscribeSucceedCanceled = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  updateNotifiers(absintheSocket, notifierRemove(notifierFlushCanceled(notifier)));

const onSubscribeSucceed = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>, {subscriptionId}) => {
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

const onSubscribe = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>, response: SubscriptionResponse) => {
  if (response.errors) {
    onError(absintheSocket, notifier, gqlErrorsToString(response.errors));
  } else {
    onSubscribeSucceed(absintheSocket, notifier, response);
  }
};

const onUnsubscribeSucceedActive = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  subscribe(absintheSocket, refreshNotifier(absintheSocket, notifierReset(notifier)));

const unsubscribeHandler: NotifierPushHandler = {
  onError: (absintheSocket, notifier, errorMessage) => abortNotifier(absintheSocket, notifier, createUnsubscribeError(errorMessage)),
  onTimeout: (_absintheSocket, notifier) => notifierNotifyCanceled(notifier, createErrorEvent(createUnsubscribeError("timeout"))),
  onSucceed: (absintheSocket, notifier) => {
    if (notifier.isActive) {
      onUnsubscribeSucceedActive(absintheSocket, notifier);
    } else {
      onUnsubscribeSucceedCanceled(absintheSocket, notifier);
    }
  },
};

const pushAbsintheUnsubscribeEvent = <R, V>(absintheSocket: AbsintheSocket<R, V>, {request, subscriptionId}): AbsintheSocket<R, V> =>
  pushAbsintheEvent(absintheSocket, request, unsubscribeHandler, createAbsintheUnsubscribeEvent({subscriptionId}));

export const onDataMessage = <R, V>(absintheSocket: AbsintheSocket<R, V>, {payload}: Message<SubscriptionPayload<any>>): void => {
  // const notifier = notifierFind(absintheSocket.notifiers, "subscriptionId", payload.subscriptionId);
  const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.subscriptionId, payload.subscriptionId));

  if (notifier) {
    notifierNotifyResultEvent(notifier, payload.result);
  }
};

export function subscribe<R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>): AbsintheSocket<R, V> {
  return pushRequestUsing(absintheSocket, notifier, onSubscribe);
}

export function unsubscribe<R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>): AbsintheSocket<R, V> {
  return pushAbsintheUnsubscribeEvent(
    absintheSocket,
    refreshNotifier(absintheSocket, {
      ...notifier,
      requestStatus: requestStatuses.canceling,
    })
  );
}

export {isDataMessage};

export {SubscriptionPayload};
