import {
	CitationIndexQuery,
	ScriptureSourceFlag,
	SortOrder,
	SourceFlag,
	Tab,
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
	const tab = params.tab;
	const speakerId = params.speakerId ?? "";
	const startYear = params.startYear ?? "";
	const endYear = params.endYear ?? "";
	const sources = validateSources(tab, params.sources);
	const sort = params.sort ?? "r";
	const pageSize = params.pageSize ?? 30;
	const offset = params.offset ?? 0;
	const luceneQuery = params.query;

	return `${base}/${tab}&${speakerId}&${startYear}&${endYear}&${sources}&${sort}&${pageSize}@${offset}$${luceneQuery}`;
}
