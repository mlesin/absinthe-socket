import { getOperationType, GqlRequest, GqlOperationType } from '../utils-graphql';
import requestStatuses from './requestStatuses';

import { Notifier } from './types';

const createUsing = <V>(request: GqlRequest<V>, operationType: GqlOperationType): Notifier => ({
  operationType,
  request,
  activeObservers: [],
  canceledObservers: [],
  isActive: true,
  requestStatus: requestStatuses.pending,
  subscriptionId: '',
});

const create = <V>(request: GqlRequest<V>): Notifier =>
  createUsing(request, getOperationType(request.operation));

export default create;
