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

const onUnsubscribeSucceedCanceled = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) => updateNotifiers(absintheSocket, notifierRemove(notifierFlushCanceled(notifier)));

const onSubscribeSucceed = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>,
  {subscriptionId}
) => {
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

const onSubscribe = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>,
  response: SubscriptionResponse
) => {
  if (response.errors) {
    onError(absintheSocket, notifier, gqlErrorsToString(response.errors));
  } else {
    onSubscribeSucceed(absintheSocket, notifier, response);
  }
};

const onUnsubscribeSucceedActive = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) => subscribe(absintheSocket, refreshNotifier(absintheSocket, notifierReset(notifier)));

const unsubscribeHandler: NotifierPushHandler<UnsubscribeResponse> = {
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

const pushAbsintheUnsubscribeEvent = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  {request, subscriptionId}
): AbsintheSocket<Result, Variables> =>
  pushAbsintheEvent(absintheSocket, request, unsubscribeHandler, createAbsintheUnsubscribeEvent({subscriptionId}));

export const onDataMessage = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  {payload}: Message<SubscriptionPayload<any>>
): void => {
  // const notifier = notifierFind(absintheSocket.notifiers, "subscriptionId", payload.subscriptionId);
  const notifier = absintheSocket.notifiers.find((ntf) => isDeepEqual(ntf.subscriptionId, payload.subscriptionId));

  if (notifier) {
    notifierNotifyResultEvent(notifier, payload.result);
  }
};

export function subscribe<Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
): AbsintheSocket<Result, Variables> {
  return pushRequestUsing(absintheSocket, notifier, onSubscribe);
}

export function unsubscribe<Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
): AbsintheSocket<Result, Variables> {
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
