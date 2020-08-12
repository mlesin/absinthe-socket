import { Notifier, Observer } from './types';

const observe = ({ activeObservers, ...rest }: Notifier, observer: Observer): Notifier => ({
  ...rest,
  activeObservers: [...activeObservers, observer],
  isActive: true,
});

export default observe;
