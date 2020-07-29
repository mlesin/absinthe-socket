import notifyActive from "./notifyActive";
import {createResultEvent} from "./event/eventCreators";
import {Notifier} from "./types";

const notifyResultEvent = <R, V>(notifier: Notifier<R, V>, result?: R): Notifier<R, V> => notifyActive(notifier, createResultEvent(result));

export default notifyResultEvent;
