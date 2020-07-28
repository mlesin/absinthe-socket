import {Notifier, Observer} from "./types";

const observe = <Result, Variables>({activeObservers, ...rest}: Notifier<Result, Variables>, observer: Observer<Result, Variables>) => ({
  ...rest,
  activeObservers: [...activeObservers, observer],
  isActive: true,
});

export default observe;
