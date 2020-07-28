import {Push} from "phoenix";

import {PushHandler} from "./types";

const handlePush = <Response>(push: Push, handler: PushHandler<Response>): Push =>
  push.receive("ok", handler.onSucceed).receive("error", handler.onError).receive("timeout", handler.onTimeout);

export default handlePush;
