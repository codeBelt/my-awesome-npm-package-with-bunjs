import type { StringFormatter } from "./strings.types.ts";

export const stringUtils: StringFormatter = {
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  reverse: (str) => {
    return str.split("").reverse().join("");
  },
  countWords: (str) => {
    return str.split(/\s+/).filter(Boolean).length;
  },
};
