import notifyCanceled from "./notifyCanceled";
import {createCancelEvent} from "./event/eventCreators";

import {Notifier} from "./types";

const clearCanceled = <R, V>(notifier: Notifier<R, V>) => ({
  ...notifier,
  canceledObservers: [],
});

const flushCanceled = <R, V>(notifier: Notifier<R, V>): Notifier<R, V> =>
  notifier.canceledObservers.length > 0 ? clearCanceled(notifyCanceled(notifier, createCancelEvent())) : notifier;

export default flushCanceled;
