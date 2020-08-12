import isDeepEqual from 'fast-deep-equal';
import { arrayReplace } from '../utils-array';
import { Notifier } from './types';

const refresh = (notifier: Notifier) => (notifiers: Array<Notifier>): Array<Notifier> =>
  arrayReplace(
    notifiers.findIndex((ntf) => isDeepEqual(ntf.request, notifier.request)),
    notifier,
    notifiers,
  );

export default refresh;
