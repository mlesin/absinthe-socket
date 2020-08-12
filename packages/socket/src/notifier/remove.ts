import isDeepEqual from 'fast-deep-equal';
import { arrayRemove } from '../utils-array';
import { Notifier } from './types';

const remove = (notifier: Notifier) => (notifiers: Array<Notifier>): Array<Notifier> =>
  arrayRemove(
    notifiers.findIndex((ntf) => isDeepEqual(ntf.request, notifier.request)),
    notifiers,
  );

export default remove;
