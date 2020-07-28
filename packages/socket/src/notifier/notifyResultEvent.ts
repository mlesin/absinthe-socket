import notifyActive from "./notifyActive";
import {createResultEvent} from "./event/eventCreators";
import {Notifier} from "./types";

const notifyResultEvent = <Result, Variables>(notifier: Notifier<Result, Variables>, result: Result): Notifier<Result, Variables> =>
  notifyActive(notifier, createResultEvent(result));

export default notifyResultEvent;
