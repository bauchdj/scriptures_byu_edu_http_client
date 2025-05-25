// Type definitions for BYU Scripture Citation Index API parameters and responses
export type { Speakers } from "./speakers";

export type Tab = "t" | "s";

// Talks Tab Flags
export enum TalkSourceFlag {
	GeneralConference = "g",
	JournalOfDiscourses = "j",
	TeachingsOfJosephSmith = "t",
}

// Scriptures Tab Flags
export enum ScriptureSourceFlag {
	OldTestament = "o",
	NewTestament = "n",
	JSTFootnotes = "f",
	BookOfMormon = "b",
	DoctrineAndCovenants = "d",
	PearlOfGreatPrice = "p",
	JST = "j",
}

// SourceFlag is still useful for generic code, but each query type uses its own specific flag array.
export type SourceFlag = TalkSourceFlag | ScriptureSourceFlag;

export type SortOrder = "r" | "n";

/**
 * Citation query for Talks tab ('t').
 * Includes speakerId, startYear, endYear.
 */
export interface TalksCitationIndexQuery {
	tab: "t";
	speakerId?: string; // empty string or numeric
	startYear?: number;
	endYear?: number;
	sources: TalkSourceFlag[];
	sort?: SortOrder;
	pageSize?: number;
	offset?: number;
	query: string;
}

/**
 * Citation query for Scriptures tab ('s').
 * Does NOT include speakerId, startYear, endYear.
 */
export interface ScripturesCitationIndexQuery {
	tab: "s";
	sources: ScriptureSourceFlag[];
	sort?: SortOrder;
	pageSize?: number;
	offset?: number;
	query: string;
}

/**
 * Union type for citation queries.
 */
export type CitationIndexQuery =
	| TalksCitationIndexQuery
	| ScripturesCitationIndexQuery;

// Example response type (to be updated after first fetch)
export const resultTitleClass = "resultTitle";
export const resultContextClass = "resultContext";
export interface CitationIndexResult {
	[resultTitleClass]: string;
	[resultContextClass]: string;
}
