import flushCanceled from "./flushCanceled";
import requestStatuses from "./requestStatuses";

import {Notifier} from "./types";

const reset = <R, V>(notifier: Notifier<R, V>): Notifier<R, V> =>
  flushCanceled({
    ...notifier,
    isActive: true,
    requestStatus: requestStatuses.pending,
    // subscriptionId: undefined,
  });

export default reset;
