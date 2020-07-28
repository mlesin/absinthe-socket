import {getOperationType, GqlRequest, GqlOperationType} from "../utils-graphql";
import requestStatuses from "./requestStatuses";

import {Notifier} from "./types";

const createUsing = <Result, Variables>(request: GqlRequest<Variables>, operationType: GqlOperationType): Notifier<Result, Variables> => ({
  operationType,
  request,
  activeObservers: [],
  canceledObservers: [],
  isActive: true,
  requestStatus: requestStatuses.pending,
  subscriptionId: undefined,
});

const create = <Result, Variables>(request: GqlRequest<Variables>): Notifier<Result, Variables> =>
  createUsing(request, getOperationType(request.operation));

export default create;
