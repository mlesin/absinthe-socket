

import { GqlRequestCompat } from "@jumpn/utils-graphql/compat/cjs/types";

import absintheEventNames from "./absintheEventNames";

import { AbsintheEventName } from "./absintheEventNames";

type AbsintheEventWith<Name extends AbsintheEventName, Payload> = {
  name: Name;
  payload: Payload;
};

type AbsintheUnsubscribeEvent = AbsintheEventWith<typeof absintheEventNames.unsubscribe, {
  subscriptionId: string;
}>;

type AbsintheDocEvent<Variables extends void | Object> = AbsintheEventWith<typeof absintheEventNames.doc, GqlRequestCompat<Variables>>;

type AbsintheEvent = AbsintheDocEvent<any> | AbsintheUnsubscribeEvent;

export { AbsintheEvent, AbsintheDocEvent, AbsintheUnsubscribeEvent };