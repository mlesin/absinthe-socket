import { GqlResponse } from './utils-graphql';
import notifierNotifyResultEvent from './notifier/notifyResultEvent';
import notifierNotifyStartEvent from './notifier/notifyStartEvent';
import notifierRemove from './notifier/remove';
import pushRequestUsing from './pushRequestUsing';
import refreshNotifier from './refreshNotifier';
import requestStatuses from './notifier/requestStatuses';
import updateNotifiers from './updateNotifiers';
import { subscribe } from './subscription';
import { AbsintheSocket } from './types';
import { Notifier } from './notifier/types';

const setNotifierRequestStatusSent = (absintheSocket: AbsintheSocket, notifier: Notifier) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sent,
  });

const onQueryOrMutationSucceed = (absintheSocket: AbsintheSocket, notifier: Notifier) => (response: GqlResponse) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierNotifyResultEvent(setNotifierRequestStatusSent(absintheSocket, notifier), response.data)),
  );

const pushQueryOrMutation = (absintheSocket: AbsintheSocket, notifier: Notifier) =>
  pushRequestUsing(absintheSocket, notifierNotifyStartEvent(notifier), onQueryOrMutationSucceed);

const pushRequest = (absintheSocket: AbsintheSocket, notifier: Notifier): AbsintheSocket => {
  if (notifier.operationType === 'subscription') {
    return subscribe(absintheSocket, notifier);
  }
  return pushQueryOrMutation(absintheSocket, notifier);
};

export default pushRequest;
