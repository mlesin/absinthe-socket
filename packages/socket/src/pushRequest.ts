import {GqlResponse} from "./utils-graphql";
import notifierNotifyResultEvent from "./notifier/notifyResultEvent";
import notifierNotifyStartEvent from "./notifier/notifyStartEvent";
import notifierRemove from "./notifier/remove";
import pushRequestUsing from "./pushRequestUsing";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";
import {subscribe} from "./subscription";
import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

const setNotifierRequestStatusSent = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sent,
  });

const onQueryOrMutationSucceed = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) => (response: GqlResponse<R>) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierNotifyResultEvent(setNotifierRequestStatusSent(absintheSocket, notifier), response.data))
  );

const pushQueryOrMutation = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) =>
  pushRequestUsing(absintheSocket, notifierNotifyStartEvent(notifier), onQueryOrMutationSucceed);

const pushRequest = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>): AbsintheSocket<R, V> => {
  if (notifier.operationType === "subscription") {
    return subscribe(absintheSocket, notifier);
  }
  return pushQueryOrMutation(absintheSocket, notifier);
};

export default pushRequest;
