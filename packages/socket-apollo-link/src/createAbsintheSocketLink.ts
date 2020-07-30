// import {$ElementType} from "utility-types";
import {ApolloLink} from "apollo-link";
import {send, toObservable, unobserveOrCancel, AbsintheSocket, Notifier, GqlRequest, Observer, Options} from "@absinthe/socket";
// import {compose} from "flow-static-land/lib/Fun";
import {print} from "graphql";
import {DocumentNode} from "graphql/language/ast";

type ApolloOperation<Variables> = {
  query: DocumentNode;
  variables: Variables;
};

const unobserveOrCancelIfNeeded = <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>, observer: Observer<R, V>) => {
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

const getRequest = <Variables>({query, variables}: ApolloOperation<Variables>): GqlRequest<Variables> => ({
  operation: print(query),
  variables,
});

/**
 * Creates a terminating ApolloLink to request operations using given
 * AbsintheSocket instance
 */
const createAbsintheSocketLink = <R, V>(
  absintheSocket: AbsintheSocket<R, V>,
  onError?: Observer<R, V>["onError"],
  onStart?: Observer<R, V>["onStart"]
): ApolloLink =>
  new ApolloLink(
    compose(notifierToObservable(absintheSocket, onError, onStart), (request: GqlRequest<V>) => send(absintheSocket, request), getRequest)
  );

export default createAbsintheSocketLink;
