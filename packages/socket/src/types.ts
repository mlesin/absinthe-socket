import { Channel, Socket as PhoenixSocket } from 'phoenix';

import { Notifier, Observer } from './notifier/types';
import { GqlResponse } from './utils-graphql';

export interface AbsintheSocket {
  channel: Channel;
  channelJoinCreated: boolean;
  notifiers: Array<Notifier>;
  phoenixSocket: PhoenixSocket;
}

export interface PushHandler {
  onError: (errorMessage: string) => void;
  onSucceed: (response: GqlResponse) => void;
  onTimeout: () => void;
}

export interface NotifierPushHandler {
  onError: (absintheSocket: AbsintheSocket, notifier: Notifier) => PushHandler['onError'];
  onSucceed: (absintheSocket: AbsintheSocket, notifier: Notifier) => PushHandler['onSucceed'];
  onTimeout: (absintheSocket: AbsintheSocket, notifier: Notifier) => PushHandler['onTimeout'];
}

export { Observer };
