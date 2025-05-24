import { expect, test } from "bun:test";
import { escapeLuceneQuery } from "../lucene";

test("escapeLuceneQuery escapes special characters", () => {
	const input = "faith AND (works) ~test*?";
	const result = escapeLuceneQuery(input);
	expect(result).toContain("\\(");
	expect(result).toContain("\\)");
	// Should not escape normal letters or spaces
	expect(result).toContain("faith");
	expect(result).toContain("works");
});

test("Lucene: OR query (any word)", () => {
	const input = "angels stand sentinels";
	const result = escapeLuceneQuery(input);
	expect(result).toBe(input);
});

test("Lucene: AND query (all words)", () => {
	const input = "+angels +stand +sentinels";
	const result = escapeLuceneQuery(input);
	expect(result).toBe(input);
});

test("Lucene: NOT query", () => {
	const input = "-angels +sentinels";
	const result = escapeLuceneQuery(input);
	expect(result).toBe(input);
});

test("Lucene: Proximity phrase", () => {
	const input = '"angels sentinels"~10';
	const result = escapeLuceneQuery(input);
	expect(result).toBe(input);
});

test("Lucene: Exact phrase", () => {
	const input = '"angels who stand"';
	const result = escapeLuceneQuery(input);
	expect(result).toBe(input);
});

test("Lucene: AND query with plus", () => {
	const input = "+Uchtdorf +hope";
	const result = escapeLuceneQuery(input);
	expect(result).toBe(input);
});

test("Lucene: Wildcard star", () => {
	const input = "angel*s";
	const result = escapeLuceneQuery(input);
	expect(result).toBe(input);
});

test("Lucene: Wildcard question mark", () => {
	const input = "s?nd";
	const result = escapeLuceneQuery(input);
	expect(result).toBe(input);
});
