export const ERROR_CODES = {
  NO_TOKEN: "NO_TOKEN",
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
