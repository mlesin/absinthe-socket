type $Values<O extends Record<string, unknown>> = O[keyof O];

const requestStatuses = {
  canceled: "canceled" as const,
  canceling: "canceling" as const,
  pending: "pending" as const,
  sent: "sent" as const,
  sending: "sending" as const,
};

type RequestStatus = $Values<typeof requestStatuses>;

export default requestStatuses;

export {RequestStatus};
