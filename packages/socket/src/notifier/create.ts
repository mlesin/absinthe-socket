import {getOperationType, GqlRequest, GqlOperationType} from "../utils-graphql";
import requestStatuses from "./requestStatuses";

import {Notifier} from "./types";

const createUsing = <R, V>(request: GqlRequest<V>, operationType: GqlOperationType): Notifier<R, V> => ({
  operationType,
  request,
  activeObservers: [],
  canceledObservers: [],
  isActive: true,
  requestStatus: requestStatuses.pending,
  subscriptionId: "",
});

const create = <R, V>(request: GqlRequest<V>): Notifier<R, V> => createUsing(request, getOperationType(request.operation));

export default create;
