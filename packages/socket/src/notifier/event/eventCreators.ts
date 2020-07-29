import {AbortEvent, CancelEvent, ErrorEvent, Notifier, ResultEvent, StartEvent} from "../types";

const createStartEvent = <R, V, P extends Notifier<R, V>>(payload: P): StartEvent<R, V, P> => ({
  payload,
  name: "onStart",
});

const createResultEvent = <R>(payload: R): ResultEvent<R> => ({
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
