import notifyCanceled from "./notifyCanceled";
import {createCancelEvent} from "./event/eventCreators";

import {Notifier} from "./types";

const clearCanceled = <Result, Variables>(notifier: Notifier<Result, Variables>) => ({
  ...notifier,
  canceledObservers: [],
});

const flushCanceled = <Result, Variables>(notifier: Notifier<Result, Variables>): Notifier<Result, Variables> =>
  notifier.canceledObservers.length > 0 ? clearCanceled(notifyCanceled(notifier, createCancelEvent())) : notifier;

export default flushCanceled;
