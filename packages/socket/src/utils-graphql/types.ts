export type GqlOperationType = "mutation" | "query" | "subscription";

export interface GqlRequest<Variables> {
  operation: GqlOperationType;
  variables?: Variables;
}

export interface GqlRequestCompat<Variables> {
  query: string;
  variables?: Variables;
}

export interface GqlErrorLocation {
  line: number;
  column: number;
}

export interface GqlError {
  message: string;
  locations?: Array<GqlErrorLocation>;
}

export interface GqlResponse<Data> {
  data?: Data;
  errors?: Array<GqlError>;
}
