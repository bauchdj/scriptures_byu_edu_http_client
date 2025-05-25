import {
	type CitationIndexQuery,
	ScriptureSourceFlag,
	type SourceFlag,
	type Tab,
	TalkSourceFlag,
} from "./types";

function validateSources(tab: Tab, sources: SourceFlag[]): string {
	if (tab === "t") {
		for (const s of sources) {
			if (
				!(Object.values(TalkSourceFlag) as string[]).includes(
					s as string
				)
			) {
				throw new Error(`Invalid source flag '${s}' for Talks tab`);
			}
		}
	} else if (tab === "s") {
		for (const s of sources) {
			if (
				!(Object.values(ScriptureSourceFlag) as string[]).includes(
					s as string
				)
			) {
				throw new Error(
					`Invalid source flag '${s}' for Scriptures tab`
				);
			}
		}
	}
	return sources.join("");
}

/**
 * Builds the BYU Scripture Citation Index API URL from parameters.
 */
export function buildCitationIndexUrl(params: CitationIndexQuery): string {
	const base =
		"https://scriptures.byu.edu/citation_index/search_results_ajax";
	const tab = encodeURIComponent(params.tab);
	const sort = encodeURIComponent(params.sort ?? "r");
	const pageSize = encodeURIComponent((params.pageSize ?? 30).toString());
	const offset = encodeURIComponent((params.offset ?? 0).toString());
	const luceneQuery = encodeURIComponent(params.query);

	if (params.tab === "t") {
		const speakerId = encodeURIComponent(params.speakerId ?? "");
		const startYear = encodeURIComponent(
			params.startYear?.toString() ?? ""
		);
		const endYear = encodeURIComponent(params.endYear?.toString() ?? "");
		const sources = encodeURIComponent(
			validateSources("t", params.sources)
		);
		return `${base}/${tab}&${speakerId}&${startYear}&${endYear}&${sources}&${sort}&${pageSize}@${offset}$${luceneQuery}`;
	} else if (params.tab === "s") {
		const sources = encodeURIComponent(
			validateSources("s", params.sources)
		);
		// Scriptures format: /s&sources&sort&pageSize@offset$query
		return `${base}/${tab}&${sources}&${sort}&${pageSize}@${offset}$${luceneQuery}`;
	} else {
		throw new Error(`Invalid tab value: ${params}`);
	}
}
