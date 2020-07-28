import {Channel, Socket as PhoenixSocket} from "phoenix";

import {Notifier, Observer} from "./notifier/types";

export interface AbsintheSocket<Result, Variables> {
  channel: Channel;
  channelJoinCreated: boolean;
  notifiers: Array<Notifier<Result, Variables>>;
  phoenixSocket: PhoenixSocket;
}

export interface PushHandler<Response extends Record<string, unknown>> {
  onError: (errorMessage: string) => void;
  onSucceed: (response: Response) => void;
  onTimeout: () => void;
}

export interface NotifierPushHandler<Response> {
  onError: <Result, Variables>(
    absintheSocket: AbsintheSocket<Result, Variables>,
    notifier: Notifier<Result, Variables>,
    errorMessage: string
  ) => void;
  onSucceed: <Result, Variables>(
    absintheSocket: AbsintheSocket<Result, Variables>,
    notifier: Notifier<Result, Variables>,
    response: Response
  ) => void;
  onTimeout: <Result, Variables>(absintheSocket: AbsintheSocket<Result, Variables>, notifier: Notifier<Result, Variables>) => void;
}

export {Observer};
