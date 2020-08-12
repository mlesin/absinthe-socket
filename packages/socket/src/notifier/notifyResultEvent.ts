import notifyActive from './notifyActive';
import { createResultEvent } from './event/eventCreators';
import { Notifier } from './types';

const notifyResultEvent = (notifier: Notifier, result?: unknown): Notifier => notifyActive(notifier, createResultEvent(result));

export default notifyResultEvent;
