import {Notifier} from "./types";

const reactivate = <R, V>(notifier: Notifier<R, V>): Notifier<R, V> => (notifier.isActive ? notifier : {...notifier, isActive: true});

export default reactivate;
