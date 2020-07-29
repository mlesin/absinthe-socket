import {Push} from "phoenix";
import {PushHandler} from "./types";

const handlePush = <R>(push: Push, handler: PushHandler<R>): Push =>
  push.receive("ok", handler.onSucceed).receive("error", handler.onError).receive("timeout", handler.onTimeout);

export default handlePush;
