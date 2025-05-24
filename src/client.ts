import type { CitationIndexQuery, CitationIndexResult } from "./types";
import { buildCitationIndexUrl } from "./urlBuilder";

/**
 * Fetch results from the BYU Scripture Citation Index API.
 */
export async function fetchCitationResults(
	query: CitationIndexQuery
): Promise<CitationIndexResult> {
	const url = buildCitationIndexUrl(query);
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`API request failed: ${response.status} ${response.statusText}`
		);
	}
	return await response.json();
}
