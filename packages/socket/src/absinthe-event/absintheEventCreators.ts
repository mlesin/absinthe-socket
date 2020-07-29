import absintheEventNames from "./absintheEventNames";

import {AbsintheDocEvent, AbsintheUnsubscribeEvent} from "./types";

type $ElementType<T extends {[P in K & unknown]: unknown}, K extends keyof T | number> = T[K];

export const createAbsintheUnsubscribeEvent = (payload: $ElementType<AbsintheUnsubscribeEvent, "payload">): AbsintheUnsubscribeEvent => ({
  payload,
  name: absintheEventNames.unsubscribe,
});

export const createAbsintheDocEvent = <V>(payload: $ElementType<AbsintheDocEvent<V>, "payload">): AbsintheDocEvent<V> => ({
  payload,
  name: absintheEventNames.doc,
});
