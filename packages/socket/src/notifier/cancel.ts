import { Notifier } from './types';

const cancel = ({ activeObservers, canceledObservers, ...rest }: Notifier): Notifier => ({
  ...rest,
  isActive: false,
  activeObservers: [],
  canceledObservers: [...activeObservers, ...canceledObservers],
});

export default cancel;
