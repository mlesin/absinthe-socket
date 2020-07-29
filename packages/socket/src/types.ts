import {Channel, Socket as PhoenixSocket} from "phoenix";

import {Notifier, Observer} from "./notifier/types";
import {GqlResponse} from "./utils-graphql";

export interface AbsintheSocket<R, V> {
  channel: Channel;
  channelJoinCreated: boolean;
  notifiers: Array<Notifier<R, V>>;
  phoenixSocket: PhoenixSocket;
}

export interface PushHandler<R> {
  onError: (errorMessage: string) => void;
  onSucceed: (response: GqlResponse<R>) => void;
  onTimeout: () => void;
}

export interface NotifierPushHandler {
  onError: <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) => PushHandler<R>["onError"];
  onSucceed: <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) => PushHandler<R>["onSucceed"];
  onTimeout: <R, V>(absintheSocket: AbsintheSocket<R, V>, notifier: Notifier<R, V>) => PushHandler<R>["onTimeout"];
}

export {Observer};
