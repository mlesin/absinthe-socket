import notifyActive from "./notifyActive";
import {createStartEvent} from "./event/eventCreators";
import {Notifier} from "./types";

const notifyStartEvent = <R, V>(notifier: Notifier<R, V>): Notifier<R, V> =>
  notifyActive(notifier, createStartEvent<R, V, Notifier<R, V>>(notifier));

export default notifyStartEvent;
