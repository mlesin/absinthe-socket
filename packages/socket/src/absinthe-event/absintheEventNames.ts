import { $Values } from "utility-types";


const absintheEventNames = {
  doc: ("doc" as "doc"),
  unsubscribe: ("unsubscribe" as "unsubscribe")
};

type AbsintheEventName = $Values<typeof absintheEventNames>;

export default absintheEventNames;

export { AbsintheEventName };