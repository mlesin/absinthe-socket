export type GqlOperationType = "mutation" | "query" | "subscription";

export interface GqlRequest<Variables> {
  operation: GqlOperationType;
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

function locationsToString(locations: Array<GqlErrorLocation>) {
  locations.map(({column, line}) => `${line}:${column}`).join("; ");
}

function errorToString(error: GqlError) {
  return error.message + (error.locations ? ` (${locationsToString(error.locations)})` : "");
}

export function gqlErrorsToString(gqlErrors: Array<GqlError>): string {
  return gqlErrors.map(errorToString).join("\n");
}
