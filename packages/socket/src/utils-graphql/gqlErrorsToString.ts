import {GqlErrorLocation, GqlError} from "./types";

const locationsToString = (locations: Array<GqlErrorLocation>) => locations.map(({column, line}) => `${line}:${column}`).join("; ");

const errorToString = (error: GqlError) => error.message + (error.locations ? ` (${locationsToString(error.locations)})` : "");

const gqlErrorsToString = (gqlErrors: Array<GqlError>): string => gqlErrors.map(errorToString).join("\n");

export default gqlErrorsToString;
