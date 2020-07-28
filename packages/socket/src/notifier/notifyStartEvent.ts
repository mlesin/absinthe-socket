import notifyActive from "./notifyActive";
import {createStartEvent} from "./event/eventCreators";
import {Notifier} from "./types";

const notifyStartEvent = <Result, Variables>(notifier: Notifier<Result, Variables>): Notifier<Result, Variables> =>
  notifyActive(notifier, createStartEvent(notifier));

export default notifyStartEvent;
