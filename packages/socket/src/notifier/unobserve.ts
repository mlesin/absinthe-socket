import { readonlyArrayRemove } from '../utils-array';

import { Notifier, Observer } from './types';

const removeObserver = (observers: ReadonlyArray<Observer>, observer: Observer) =>
  readonlyArrayRemove(observers.indexOf(observer), observers);

const unobserve = ({ activeObservers, ...rest }: Notifier, observer: Observer): Notifier => ({
  ...rest,
  activeObservers: removeObserver(activeObservers, observer),
});

export default unobserve;
