import {GqlOperationType, GqlRequest} from "../utils-graphql";
import {RequestStatus} from "./requestStatuses";

export interface Observer<R, V = void> {
  onAbort?: (error: Error) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
  onStart?: (notifier: Notifier<R, V>) => void;
  onResult?: (result: R) => void;
}

export interface Notifier<R, V> {
  activeObservers: ReadonlyArray<Observer<R, V>>;
  canceledObservers: ReadonlyArray<Observer<R, V>>;
  isActive: boolean;
  operationType: GqlOperationType;
  request: GqlRequest<V>;
  requestStatus: RequestStatus;
  subscriptionId: string;
}

interface EventWith<Name extends keyof Observer<unknown>, Payload> {
  tag: Name;
  payload?: Payload;
}

export type StartEvent<R, V, Payload extends Notifier<R, V>> = EventWith<"onStart", Payload>;

export type ResultEvent<R> = EventWith<"onResult", R>;

export type ErrorEvent = EventWith<"onError", Error>;

export type CancelEvent = EventWith<"onCancel", undefined>;

export type AbortEvent = EventWith<"onAbort", Error>;

export type Event<R, V> = AbortEvent | CancelEvent | ErrorEvent | ResultEvent<R> | StartEvent<R, V, Notifier<R, V>>;
