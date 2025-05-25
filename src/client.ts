import { load, type CheerioAPI } from "cheerio";
import {
	resultContextClass,
	resultTitleClass,
	type CitationIndexQuery,
	type CitationIndexResult,
} from "./types";
import { buildCitationIndexUrl } from "./urlBuilder";

async function fetchHtmlWithCheerio(url: string) {
	const response = await fetch(url);

	const contentType = response.headers.get("content-type") || "";

	if (!response.ok) {
		throw new Error(
			`Failed to fetch ${url}: ${response.status} ${response.statusText}`
		);
	}

	if (!contentType.includes("text/html")) {
		throw new Error(`Unexpected content type: ${contentType}`);
	}

	const html = await response.text();

	return load(html);
}

function parseHtml(html: CheerioAPI) {
	const searchResultsNode = html("ul.searchresults");
	const results: CitationIndexResult[] = [];
	searchResultsNode.find("li").each((_, el) => {
		const result: CitationIndexResult = {
			[resultTitleClass]: html(el)
				.find("." + resultTitleClass)
				.text(),
			[resultContextClass]: html(el)
				.find("." + resultContextClass)
				.text(),
		};
		results.push(result);
	});
	return results;
}

/**
 * Fetch results from the BYU Scripture Citation Index API.
 */
export async function fetchCitationResults(
	query: CitationIndexQuery
): Promise<CitationIndexResult[]> {
	const url = buildCitationIndexUrl(query);
	const cheerioHtml = await fetchHtmlWithCheerio(url);
	const parsedHtml = parseHtml(cheerioHtml);
	return parsedHtml;
}
