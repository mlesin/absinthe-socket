import absintheEventNames from "./absintheEventNames";

import {AbsintheDocEvent, AbsintheUnsubscribeEvent} from "./types";

export const createAbsintheUnsubscribeEvent = (payload: AbsintheUnsubscribeEvent["payload"]): AbsintheUnsubscribeEvent => ({
  payload,
  name: absintheEventNames.unsubscribe,
});

export const createAbsintheDocEvent = <V>(payload: AbsintheDocEvent<V>["payload"]): AbsintheDocEvent<V> => ({
  payload,
  name: absintheEventNames.doc,
});
