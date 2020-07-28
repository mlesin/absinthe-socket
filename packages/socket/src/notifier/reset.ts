import flushCanceled from "./flushCanceled";
import requestStatuses from "./requestStatuses";

import {Notifier} from "./types";

const reset = <Result, Variables>(notifier: Notifier<Result, Variables>) =>
  flushCanceled({
    ...notifier,
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined,
  });

export default reset;
