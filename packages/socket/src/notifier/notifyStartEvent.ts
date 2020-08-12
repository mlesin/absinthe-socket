import notifyActive from './notifyActive';
import { createStartEvent } from './event/eventCreators';
import { Notifier } from './types';

const notifyStartEvent = (notifier: Notifier): Notifier =>
  notifyActive(notifier, createStartEvent<Notifier>(notifier));

export default notifyStartEvent;
