// import {$ElementType} from "utility-types";
import {ApolloLink, FetchResult} from "apollo-link";
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
// import {compose} from "flow-static-land/lib/Fun";
import {print} from "graphql";
import {DocumentNode} from "graphql/language/ast";
import {pipe} from "fp-ts/lib/pipeable";
import {flow} from "fp-ts/lib/function";

type ApolloOperation<Variables> = {
  query: DocumentNode;
  variables: Variables;
};

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

// const getRequest = <V>({query, variables}: ApolloOperation<V>): GqlRequest<V> => ({
//   operation: getOperationType(print(query)),
//   variables,
// });

/**
 * Creates a terminating ApolloLink to request operations using given
 * AbsintheSocket instance
 */
const createAbsintheSocketLink = <R, V extends Record<string, any>>(
  absintheSocket: AbsintheSocket<R, V>,
  onError?: Observer<R, V>["onError"],
  onStart?: Observer<R, V>["onStart"]
): ApolloLink => {
  const composed = flow(
    ({query, variables}: ApolloOperation<V>): GqlRequest<V> => ({
      operation: getOperationType(print(query)),
      variables,
    }),
    (request: GqlRequest<V>) => send(absintheSocket, request),
    notifierToObservable(absintheSocket, onError, onStart)
  );
  return new ApolloLink(
    composed
    // (operation: ApolloOperation<any>) => composed(operation)
    // compose(notifierToObservable(absintheSocket, onError, onStart), (request: GqlRequest<V>) => send(absintheSocket, request), getRequest)
    // flow(getRequest, (request: GqlRequest<V>) => send(absintheSocket, request), notifierToObservable(absintheSocket, onError, onStart))
  );
};

export default createAbsintheSocketLink;
