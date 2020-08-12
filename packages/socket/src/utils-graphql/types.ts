import { DocumentNode, OperationTypeNode } from 'graphql';

export type GqlOperationType = OperationTypeNode;

export interface GqlRequest<V> {
  operation: DocumentNode;
  variables?: V;
}

export interface GqlRequestCompat<V> {
  query: string;
  variables?: V;
}

export interface GqlErrorLocation {
  line: number;
  column: number;
}

export interface GqlError {
  message: string;
  locations?: Array<GqlErrorLocation>;
}

export interface GqlResponse {
  data?: unknown;
  errors?: Array<GqlError>;
}
