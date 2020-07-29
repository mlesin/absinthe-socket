import {Push} from "phoenix";
import {PushHandler} from "./types";

const handlePush = <Result>(push: Push, handler: PushHandler<Result>): Push =>
  push.receive("ok", handler.onSucceed).receive("error", handler.onError).receive("timeout", handler.onTimeout);

export default handlePush;
