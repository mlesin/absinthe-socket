export type GqlOperationType = "mutation" | "query" | "subscription";

export interface GqlRequest<V> {
  operation: GqlOperationType;
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

export interface GqlResponse<R> {
  data?: R;
  errors?: Array<GqlError>;
}
