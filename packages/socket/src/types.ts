import {Channel, Socket as PhoenixSocket} from "phoenix";

import {Notifier, Observer} from "./notifier/types";
import {GqlResponse} from "./utils-graphql";

export interface AbsintheSocket<Result, Variables> {
  channel: Channel;
  channelJoinCreated: boolean;
  notifiers: Array<Notifier<Result, Variables>>;
  phoenixSocket: PhoenixSocket;
}

export interface PushHandler<Result> {
  onError: (errorMessage: string) => void;
  onSucceed: (response: GqlResponse<Result>) => void;
  onTimeout: () => void;
}

export interface NotifierPushHandler {
  onError: <Result, Variables>(
    absintheSocket: AbsintheSocket<Result, Variables>,
    notifier: Notifier<Result, Variables>,
    errorMessage: string
  ) => void;
  onSucceed: <Result, Variables>(
    absintheSocket: AbsintheSocket<Result, Variables>,
    notifier: Notifier<Result, Variables>,
    response: GqlResponse<Result>
  ) => void;
  onTimeout: <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) => void;
}

export {Observer};
