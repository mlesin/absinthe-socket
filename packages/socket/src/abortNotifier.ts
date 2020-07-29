import notifierNotify from "./notifier/notify";
import notifierRemove from "./notifier/remove";
import updateNotifiers from "./updateNotifiers";
import {createAbortEvent} from "./notifier/event/eventCreators";

import {AbsintheSocket} from "./types";
import {Notifier} from "./notifier/types";

const abortNotifier = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>, error: Error): AbsintheSocket<R, V> =>
  updateNotifiers(absintheSocket, notifierRemove(notifierNotify(notifier, createAbortEvent(error))));

export default abortNotifier;
