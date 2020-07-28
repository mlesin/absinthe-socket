import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

type Notifiers = Array<Notifier<any, any>>;

const updateNotifiers = (absintheSocket: AbsintheSocket, updater: (notifiers: Notifiers) => Notifiers): AbsintheSocket => {
  absintheSocket.notifiers = updater(absintheSocket.notifiers);

  return absintheSocket;
};

export default updateNotifiers;
