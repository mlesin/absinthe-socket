import {GqlOperationType, GqlRequest} from "../gql";

// import eventNames, {EventName} from "./event/eventNames";

import {RequestStatus} from "./requestStatuses";

export interface Observer<Result, Variables = void> {
  onAbort?: (error: Error) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
  onStart?: (notifier: Notifier<Result, Variables>) => void;
  onResult?: (result: Result) => void;
}

export interface Notifier<Result, Variables> {
  activeObservers: ReadonlyArray<Observer<Result, Variables>>;
  canceledObservers: ReadonlyArray<Observer<Result, Variables>>;
  isActive: boolean;
  operationType: GqlOperationType;
  request: GqlRequest<Variables>;
  requestStatus: RequestStatus;
  subscriptionId?: string;
}

interface EventWith<Name extends keyof Observer<unknown>, Payload = void> {
  name: Name;
  payload: Payload;
}

export type StartEvent<Payload extends Notifier<any, any>> = EventWith<"onStart", Payload>;

export type ResultEvent<Result> = EventWith<"onResult", Result>;

export type ErrorEvent = EventWith<"onError", Error>;

export type CancelEvent = EventWith<"onCancel">;

export type AbortEvent = EventWith<"onAbort", Error>;

export type Event = AbortEvent | CancelEvent | ErrorEvent | ResultEvent<any> | StartEvent<any>;
