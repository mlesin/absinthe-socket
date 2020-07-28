import {$ElementType} from "utility-types";

import absintheEventNames from "./absintheEventNames";

import {AbsintheDocEvent, AbsintheUnsubscribeEvent} from "./types";

const createAbsintheUnsubscribeEvent = (payload: $ElementType<AbsintheUnsubscribeEvent, "payload">): AbsintheUnsubscribeEvent => ({
  payload,
  name: absintheEventNames.unsubscribe,
});

const createAbsintheDocEvent = <Variables>(payload: $ElementType<AbsintheDocEvent<Variables>, "payload">): AbsintheDocEvent<Variables> => ({
  payload,
  name: absintheEventNames.doc,
});

export {createAbsintheDocEvent, createAbsintheUnsubscribeEvent};
