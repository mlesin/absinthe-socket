import {Message} from "phoenix";
import {gqlErrorsToString, GqlError, GqlResponse} from "./gql";

import abortNotifier from "./abortNotifier";
import notifierFind from "./notifier/find";
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

function onUnsubscribeSucceedCanceled(absintheSocket: AbsintheSocket, notifier) {
  updateNotifiers(absintheSocket, notifierRemove(notifierFlushCanceled(notifier)));
}

function onSubscribeSucceed(absintheSocket: AbsintheSocket, notifier, {subscriptionId}) {
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
}

const onSubscribe = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>, response: SubscriptionResponse) => {
  if (response.errors) {
    onError(absintheSocket, notifier, gqlErrorsToString(response.errors));
  } else {
    onSubscribeSucceed(absintheSocket, notifier, response);
  }
};

const onUnsubscribeSucceedActive = (absintheSocket: AbsintheSocket, notifier) =>
  subscribe(absintheSocket, refreshNotifier(absintheSocket, notifierReset(notifier)));

const unsubscribeHandler: NotifierPushHandler<UnsubscribeResponse> = {
  onError: (absintheSocket, notifier, errorMessage) => abortNotifier(absintheSocket, notifier, createUnsubscribeError(errorMessage)),

  onTimeout: (absintheSocket, notifier) => notifierNotifyCanceled(notifier, createErrorEvent(createUnsubscribeError("timeout"))),

  onSucceed: (absintheSocket, notifier) => {
    if (notifier.isActive) {
      onUnsubscribeSucceedActive(absintheSocket, notifier);
    } else {
      onUnsubscribeSucceedCanceled(absintheSocket, notifier);
    }
  },
};

const pushAbsintheUnsubscribeEvent = (absintheSocket: AbsintheSocket, {request, subscriptionId}): AbsintheSocket =>
  pushAbsintheEvent(absintheSocket, request, unsubscribeHandler, createAbsintheUnsubscribeEvent({subscriptionId}));

export const onDataMessage = (absintheSocket: AbsintheSocket, {payload}: Message<SubscriptionPayload<any>>): void => {
  const notifier = notifierFind(absintheSocket.notifiers, "subscriptionId", payload.subscriptionId);

  if (notifier) {
    notifierNotifyResultEvent(notifier, payload.result);
  }
};

export const subscribe = <Result, Variables>(absintheSocket: AbsintheSocket, notifier: Notifier<Result, Variables>): AbsintheSocket =>
  pushRequestUsing(absintheSocket, notifier, onSubscribe);

export const unsubscribe = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>): AbsintheSocket =>
  pushAbsintheUnsubscribeEvent(
    absintheSocket,
    refreshNotifier(absintheSocket, {
      ...notifier,
      requestStatus: requestStatuses.canceling,
    })
  );

const createUnsubscribeError = (message) => new Error(`unsubscribe: ${message}`);

const dataMessageEventName = "subscription:data";

const isDataMessage = (message: Message<>) => message.event === dataMessageEventName;

export {isDataMessage};

export {SubscriptionPayload};
