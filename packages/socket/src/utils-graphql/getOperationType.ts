import { DocumentNode } from 'graphql';
import { GqlOperationType } from './types';

/**
 * Returns the type (query, mutation, or subscription) of the given operation
 *
 * @example
 *
 * const operation = `
 *   subscription userSubscription($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * const operationType = getOperationType(operation);
 *
 * console.log(operationType); // "subscription"
 */
const getOperationType = (operation: DocumentNode): GqlOperationType => {
  const opdef = operation.definitions.find(({ kind }) => kind === 'OperationDefinition');
  if (opdef?.kind === 'OperationDefinition') {
    return opdef.operation;
  }
  throw new TypeError(`Invalid operation:\n${operation}`);
};

export default getOperationType;
