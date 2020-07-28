import {AbortEvent, CancelEvent, ErrorEvent, Notifier, ResultEvent, StartEvent} from "../types";

const createStartEvent = <Result, Variables, Payload extends Notifier<Result, Variables>>(
  payload: Payload
): StartEvent<Result, Variables, Payload> => ({
  payload,
  name: "onStart",
});

const createResultEvent = <Result>(payload: Result): ResultEvent<Result> => ({
  payload,
  name: "onResult",
});

const createErrorEvent = (payload: Error): ErrorEvent => ({
  payload,
  name: "onError",
});

const createCancelEvent = (): CancelEvent => ({
  name: "onCancel",
  payload: undefined,
});

const createAbortEvent = (payload: Error): AbortEvent => ({
  payload,
  name: "onAbort",
});

export {createStartEvent, createResultEvent, createErrorEvent, createCancelEvent, createAbortEvent};
