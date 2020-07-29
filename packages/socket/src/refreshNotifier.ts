import notifierRefresh from "./notifier/refresh";
import updateNotifiers from "./updateNotifiers";
import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

const refreshNotifier = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>): Notifier<R, V> => {
  updateNotifiers(absintheSocket, notifierRefresh(notifier));

  return notifier;
};

export default refreshNotifier;
