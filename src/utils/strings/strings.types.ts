export interface StringFormatter {
  capitalize: (str: string) => string;
  reverse: (str: string) => string;
  countWords: (str: string) => number;
}
