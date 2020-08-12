import flushCanceled from './flushCanceled';
import requestStatuses from './requestStatuses';

import { Notifier } from './types';

const reset = (notifier: Notifier): Notifier =>
  flushCanceled({
    ...notifier,
    isActive: true,
    requestStatus: requestStatuses.pending,
    // subscriptionId: undefined,
  });

export default reset;
