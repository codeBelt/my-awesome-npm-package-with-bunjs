import { expect, test, describe } from "bun:test";
import { numberUtils } from "./numbers.ts";

describe("number utils", () => {
  describe("isEven", () => {
    test("returns true for even numbers", () => {
      expect(numberUtils.isEven(2)).toBe(true);
      expect(numberUtils.isEven(100)).toBe(true);
    });

    test("returns false for odd numbers", () => {
      expect(numberUtils.isEven(1)).toBe(false);
      expect(numberUtils.isEven(99)).toBe(false);
    });
  });

  describe("isOdd", () => {
    test("returns true for odd numbers", () => {
      expect(numberUtils.isOdd(1)).toBe(true);
      expect(numberUtils.isOdd(99)).toBe(true);
    });

    test("returns false for even numbers", () => {
      expect(numberUtils.isOdd(2)).toBe(false);
      expect(numberUtils.isOdd(100)).toBe(false);
    });
  });

  describe("sum", () => {
    test("sums an array of numbers", () => {
      expect(numberUtils.sum([1, 2, 3, 4])).toBe(10);
    });

    test("returns 0 for empty array", () => {
      expect(numberUtils.sum([])).toBe(0);
    });
  });
});
