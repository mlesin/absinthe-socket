export interface Message<Payload> {
  topic: string;
  event: string;
  payload: Payload;
  ref: null | number;
  join_ref: null | number;
}
