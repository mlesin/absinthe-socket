type $Values<O extends Record<string, unknown>> = O[keyof O];

const absintheEventNames = {
  doc: "doc" as const,
  unsubscribe: "unsubscribe" as const,
};

type AbsintheEventName = $Values<typeof absintheEventNames>;

export default absintheEventNames;

export {AbsintheEventName};
