import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

const updateNotifiers = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  updater: (notifiers: Array<Notifier<R, V>>) => Array<Notifier<R, V>>
): AbsintheSocket<R, V> => {
  absintheSocket.notifiers = updater(absintheSocket.notifiers);

  return absintheSocket;
};

export default updateNotifiers;
