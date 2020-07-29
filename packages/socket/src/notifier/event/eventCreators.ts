import {AbortEvent, CancelEvent, ErrorEvent, Notifier, ResultEvent, StartEvent} from "../types";

const createStartEvent = <R, V, P extends Notifier<R, V>>(payload: P): StartEvent<R, V, P> => ({
  payload,
  tag: "onStart",
});

const createResultEvent = <R>(payload: R): ResultEvent<R> => ({
  payload,
  tag: "onResult",
});

const createErrorEvent = (payload: Error): ErrorEvent => ({
  payload,
  tag: "onError",
});

const createCancelEvent = (): CancelEvent => ({
  tag: "onCancel",
  payload: undefined,
});

const createAbortEvent = (payload: Error): AbortEvent => ({
  payload,
  tag: "onAbort",
});

export {createStartEvent, createResultEvent, createErrorEvent, createCancelEvent, createAbortEvent};
