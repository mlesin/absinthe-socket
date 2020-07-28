import {$Values} from "utility-types";

const absintheEventNames = {
  doc: "doc" as const,
  unsubscribe: "unsubscribe" as const,
};

type AbsintheEventName = $Values<typeof absintheEventNames>;

export default absintheEventNames;

export {AbsintheEventName};
