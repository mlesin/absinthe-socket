import {ApolloLink, Operation, Observable} from "@apollo/client";
import {
  send,
  toObservable,
  unobserveOrCancel,
  AbsintheSocket,
  Notifier,
  GqlRequest,
  Observer,
  Options,
  getOperationType,
} from "@absinthe/socket";
import {print} from "graphql";
import {flow} from "fp-ts/lib/function";

const unobserveOrCancelIfNeeded = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier?: Notifier<R, V>, observer?: Observer<R, V>) => {
  if (notifier && observer) {
    unobserveOrCancel(absintheSocket, notifier, observer);
  }
};

const notifierToObservable = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  onError: Options<R, V>["onError"],
  onStart: Options<R, V>["onStart"]
) => (notifier: Notifier<R, V>) =>
  toObservable(absintheSocket, notifier, {
    onError,
    onStart,
    unsubscribe: unobserveOrCancelIfNeeded,
  });

const getRequest = <V>(op: Operation): GqlRequest<V> => ({
  operation: getOperationType(print(op.query)),
  variables: op.variables as V, // FIXME need a validation here?
});

// Just to help bundler do tree-shaking
type OnErrorHandler<R, V> = Observer<R, V>["onError"];
type OnStartHandler<R, V> = Observer<R, V>["onStart"];

/**
 * Creates a terminating ApolloLink to request operations using given
 * AbsintheSocket instance
 */
const createAbsintheSocketLink = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  onError?: OnErrorHandler<R, V>,
  onStart?: OnStartHandler<R, V>
): ApolloLink => {
  const composed: (__0: Operation) => Observable<R> = flow(
    getRequest,
    (request: GqlRequest<V>) => send(absintheSocket, request),
    notifierToObservable(absintheSocket, onError, onStart)
  );
  return new ApolloLink(composed);
};

export default createAbsintheSocketLink;
