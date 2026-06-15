export const BREAKPOINTS = {
  md: 768,
} as const;

export const MOBILE_QUERY = `(max-width: ${BREAKPOINTS.md - 1}px)`;
