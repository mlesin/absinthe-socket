import { GqlOperationType, GqlRequest } from '../utils-graphql';
import { RequestStatus } from './requestStatuses';

export interface Observer {
  onAbort?: (error: Error) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
  onStart?: (notifier: Notifier) => void;
  onResult?: (result: Record<string, unknown>) => void;
}

export interface Notifier {
  activeObservers: ReadonlyArray<Observer>;
  canceledObservers: ReadonlyArray<Observer>;
  isActive: boolean;
  operationType: GqlOperationType;
  request: GqlRequest<unknown>;
  requestStatus: RequestStatus;
  subscriptionId: string;
}

interface EventWith<Name extends keyof Observer, Payload> {
  tag: Name;
  payload?: Payload;
}

export type StartEvent<Payload extends Notifier> = EventWith<'onStart', Payload>;
export type ResultEvent<R> = EventWith<'onResult', R>;
export type ErrorEvent = EventWith<'onError', Error>;
export type CancelEvent = EventWith<'onCancel', undefined>;
export type AbortEvent = EventWith<'onAbort', Error>;

export type Event = AbortEvent | CancelEvent | ErrorEvent | ResultEvent<unknown> | StartEvent<Notifier>;
