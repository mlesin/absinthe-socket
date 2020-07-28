import {Notifier} from "./types";

const reactivate = <Result, Variables>(notifier: Notifier<Result, Variables>): Notifier<Result, Variables> =>
  notifier.isActive ? notifier : {...notifier, isActive: true};

export default reactivate;
