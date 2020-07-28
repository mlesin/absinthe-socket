import notifierRefresh from "./notifier/refresh";
import updateNotifiers from "./updateNotifiers";

import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

const refreshNotifier = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  notifier: Notifier<Result, Variables>
): Notifier<Result, Variables> => {
  updateNotifiers(absintheSocket, notifierRefresh(notifier));

  return notifier;
};

export default refreshNotifier;
