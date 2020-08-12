import notifierRefresh from './notifier/refresh';
import updateNotifiers from './updateNotifiers';
import { AbsintheSocket } from './types';
import { Notifier } from './notifier/types';

const refreshNotifier = (absintheSocket: AbsintheSocket, notifier: Notifier): Notifier => {
  updateNotifiers(absintheSocket, notifierRefresh(notifier));

  return notifier;
};

export default refreshNotifier;
