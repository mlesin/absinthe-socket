import {GqlRequestCompat} from "../utils-graphql";

import absintheEventNames, {AbsintheEventName} from "./absintheEventNames";

type AbsintheEventWith<N extends AbsintheEventName, P> = {
  name: N;
  payload: P;
};

export type AbsintheUnsubscribeEvent = AbsintheEventWith<
  typeof absintheEventNames.unsubscribe,
  {
    subscriptionId: string;
  }
>;

export type AbsintheDocEvent<V> = AbsintheEventWith<typeof absintheEventNames.doc, GqlRequestCompat<V>>;

export type AbsintheEvent = AbsintheDocEvent<any> | AbsintheUnsubscribeEvent;
