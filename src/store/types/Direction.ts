export type Direction = "nw" | "n" | "ne" | "e" | "sw" | "s" | "se" | "w";

export const directions: Direction[] = Object.values({
  nw: "nw",
  n: "n",
  ne: "ne",
  e: "e",
  se: "se",
  s: "s",
  sw: "sw",
  w: "w",
} satisfies { [k in Direction]: k });
