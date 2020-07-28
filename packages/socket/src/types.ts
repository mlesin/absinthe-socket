import {Channel, Socket as PhoenixSocket} from "phoenix";

import {Notifier, Observer} from "./notifier/types";

export interface AbsintheSocket {
  channel: Channel;
  channelJoinCreated: boolean;
  notifiers: Array<Notifier<any, any>>;
  phoenixSocket: PhoenixSocket;
}

export interface PushHandler<Response extends Record<string, unknown>> {
  onError: (errorMessage: string) => void;
  onSucceed: (response: Response) => void;
  onTimeout: () => void;
}

export interface NotifierPushHandler<Response extends Record<string, unknown>> {
  onError: (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>, errorMessage: string) => void;
  onSucceed: (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>, response: Response) => void;
  onTimeout: (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) => void;
}

export {Observer};
