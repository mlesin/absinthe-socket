import {GqlRequestCompat} from "../utils-graphql";

import absintheEventNames, {AbsintheEventName} from "./absintheEventNames";

type AbsintheEventWith<Name extends AbsintheEventName, Payload> = {
  name: Name;
  payload: Payload;
};

export type AbsintheUnsubscribeEvent = AbsintheEventWith<
  typeof absintheEventNames.unsubscribe,
  {
    subscriptionId: string;
  }
>;

export type AbsintheDocEvent<Variables> = AbsintheEventWith<typeof absintheEventNames.doc, GqlRequestCompat<Variables>>;

export type AbsintheEvent = AbsintheDocEvent<any> | AbsintheUnsubscribeEvent;
