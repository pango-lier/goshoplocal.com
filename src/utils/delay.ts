export const delay = (s: number) =>
  new Promise((rs) => setTimeout(rs, s * 1000));
export const delayMs = (s: number) => new Promise((rs) => setTimeout(rs, s));
