import { AbsintheSocket } from './types';
import { Notifier } from './notifier/types';

const updateNotifiers = (
  absintheSocket: AbsintheSocket,
  updater: (notifiers: Array<Notifier>) => Array<Notifier>,
): AbsintheSocket => {
  absintheSocket.notifiers = updater(absintheSocket.notifiers);

  return absintheSocket;
};

export default updateNotifiers;
