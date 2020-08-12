import notifyCanceled from './notifyCanceled';
import { createCancelEvent } from './event/eventCreators';

import { Notifier } from './types';

const clearCanceled = (notifier: Notifier) => ({
  ...notifier,
  canceledObservers: [],
});

const flushCanceled = (notifier: Notifier): Notifier =>
  notifier.canceledObservers.length > 0
    ? clearCanceled(notifyCanceled(notifier, createCancelEvent()))
    : notifier;

export default flushCanceled;
