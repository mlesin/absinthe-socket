import {getOperationType, GqlRequest} from "../utils-graphql";

import requestStatuses from "./requestStatuses";

import {Notifier} from "./types";

const createUsing = (request, operationType) => ({
  operationType,
  request,
  activeObservers: [],
  canceledObservers: [],
  isActive: true,
  requestStatus: requestStatuses.pending,
  subscriptionId: undefined,
});

const create = <Variables>(request: GqlRequest<Variables>): Notifier<any, $Subtype<Variables>> =>
  createUsing(request, getOperationType(request.operation));

export default create;
