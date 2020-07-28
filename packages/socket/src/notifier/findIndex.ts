import {hasIn} from "@jumpn/utils-composite";
import {Notifier} from "./types";

const findIndex = <Result, Variables>(
  notifiers: Array<Notifier<Result, Variables>>,
  key: string,
  value: any // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
) => notifiers.findIndex(hasIn([key], value));

export default findIndex;
