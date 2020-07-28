// import {$ElementType} from "utility-types";
import {ApolloLink} from "apollo-link";
import {send, toObservable, unobserveOrCancel, AbsintheSocket, Notifier, GqlRequest, Observer} from "@absinthe/socket";
import {compose} from "flow-static-land/lib/Fun";
import {print} from "graphql";
import {DocumentNode} from "graphql/language/ast";

type $ElementType<T extends {[P in K & any]: any}, K extends keyof T | number> = T[K];

type ApolloOperation<Variables> = {
  query: DocumentNode;
  variables: Variables;
};

const unobserveOrCancelIfNeeded = <Result, Variables>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>
) => {
  if (notifier && observer) {
    unobserveOrCancel(absintheSocket, notifier, observer);
  }
};

const notifierToObservable = (absintheSocket: AbsintheSocket, onError, onStart) => (notifier) =>
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
const createAbsintheSocketLink = <Result, Variables>(
  absintheSocket: AbsintheSocket,
  onError?: $ElementType<Observer<Result, Variables>, "onError">,
  onStart?: $ElementType<Observer<Result, Variables>, "onStart">
): ApolloLink =>
  new ApolloLink(compose(notifierToObservable(absintheSocket, onError, onStart), (request) => send(absintheSocket, request), getRequest));

export default createAbsintheSocketLink;
