import type { NumberUtils } from "./numbers.types.ts";

export const numberUtils: NumberUtils = {
  isEven: (num) => num % 2 === 0,
  isOdd: (num) => num % 2 !== 0,
  sum: (nums) => nums.reduce((acc, val) => acc + val, 0),
};
