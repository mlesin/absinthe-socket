import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

const updateNotifiers = <Result, Variables>(
  absintheSocket: AbsintheSocket<Result, Variables>,
  updater: (notifiers: Array<Notifier<Result, Variables>>) => Array<Notifier<Result, Variables>>
): AbsintheSocket<Result, Variables> => {
  absintheSocket.notifiers = updater(absintheSocket.notifiers);

  return absintheSocket;
};

export default updateNotifiers;
