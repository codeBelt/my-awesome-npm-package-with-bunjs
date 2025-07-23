import { describe, expect, test } from "bun:test";
import { stringUtils } from "./strings.ts";

describe("string utils", () => {
  describe("capitalize", () => {
    test("capitalizes the first letter of a string", () => {
      expect(stringUtils.capitalize("hello")).toBe("Hello");
    });

    test("returns empty string for empty input", () => {
      expect(stringUtils.capitalize("")).toBe("");
    });
  });

  describe("reverse", () => {
    test("reverses the characters in a string", () => {
      expect(stringUtils.reverse("hello")).toBe("olleh");
    });

    test("handles empty string", () => {
      expect(stringUtils.reverse("")).toBe("");
    });
  });

  describe("countWords", () => {
    test("counts words in a string", () => {
      expect(stringUtils.countWords("hello world")).toBe(2);
    });

    test("handles empty string", () => {
      expect(stringUtils.countWords("")).toBe(0);
    });

    test("handles multiple spaces", () => {
      expect(stringUtils.countWords("hello world test")).toBe(3);
    });
  });
});
