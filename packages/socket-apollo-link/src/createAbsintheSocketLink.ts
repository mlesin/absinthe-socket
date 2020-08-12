import { ApolloLink, Operation, Observable } from '@apollo/client/core';
import { send, toObservable, unobserveOrCancel, AbsintheSocket, Notifier, GqlRequest, Observer, Options } from '@absinthe/socket';
import { flow } from 'fp-ts/lib/function';

const unobserveOrCancelIfNeeded = (absintheSocket: AbsintheSocket, notifier?: Notifier, observer?: Observer) => {
  if (notifier && observer) {
    unobserveOrCancel(absintheSocket, notifier, observer);
  }
};

const notifierToObservable = (absintheSocket: AbsintheSocket, onError: Options['onError'], onStart: Options['onStart']) => (
  notifier: Notifier,
) =>
  toObservable(absintheSocket, notifier, {
    onError,
    onStart,
    unsubscribe: unobserveOrCancelIfNeeded,
  });

const getRequest = <V>(op: Operation): GqlRequest<V> => ({
  operation: op.query,
  variables: op.variables as V, // FIXME need a validation here?
});

// Just to help bundler do tree-shaking
type OnErrorHandler = Observer['onError'];
type OnStartHandler = Observer['onStart'];

/**
 * Creates a terminating ApolloLink to request operations using given
 * AbsintheSocket instance
 */
const createAbsintheSocketLink = (absintheSocket: AbsintheSocket, onError?: OnErrorHandler, onStart?: OnStartHandler): ApolloLink => {
  const requestHandler: (__0: Operation) => Observable<Record<string, unknown>> = flow(
    getRequest,
    (request: GqlRequest<unknown>) => send(absintheSocket, request),
    notifierToObservable(absintheSocket, onError, onStart),
  );
  return new ApolloLink(requestHandler);
};

export default createAbsintheSocketLink;
