import { test, expect } from "bun:test";
import { getNextOffset, getPrevOffset } from "../pagination";

test("getNextOffset returns correct next offset", () => {
  expect(getNextOffset(0, 30)).toBe(30);
  expect(getNextOffset(30, 30)).toBe(60);
});

test("getPrevOffset returns correct previous offset", () => {
  expect(getPrevOffset(30, 30)).toBe(0);
  expect(getPrevOffset(0, 30)).toBe(0);
});
