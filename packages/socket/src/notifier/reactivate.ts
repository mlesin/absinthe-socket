import { Notifier } from './types';

const reactivate = (notifier: Notifier): Notifier => (notifier.isActive ? notifier : { ...notifier, isActive: true });

export default reactivate;
