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

const setNotifierRequestStatusSent = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sent,
  });

const onQueryOrMutationSucceed = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>,
  response: GqlResponse<Result>
) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierNotifyResultEvent(setNotifierRequestStatusSent(absintheSocket, notifier), response))
  );

const pushQueryOrMutation = <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) =>
  pushRequestUsing(absintheSocket, notifierNotifyStartEvent(notifier), onQueryOrMutationSucceed);

const pushRequest = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
): AbsintheSocket<Result, Variables> => {
  if (notifier.operationType === "subscription") {
    return subscribe(absintheSocket, notifier);
  }
  return pushQueryOrMutation(absintheSocket, notifier);
};

export default pushRequest;
