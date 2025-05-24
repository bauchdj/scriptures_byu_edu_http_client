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

export type SourceFlag = TalkSourceFlag | ScriptureSourceFlag;

export type SortOrder = "r" | "n";

export interface CitationIndexQuery {
	tab: Tab;
	speakerId?: string; // empty string or numeric
	startYear?: number;
	endYear?: number;
	sources: SourceFlag[];
	sort?: SortOrder;
	pageSize?: number;
	offset?: number;
	query: string;
}

// Example response type (to be updated after first fetch)
export interface CitationIndexResult {
	// TODO: define based on actual API response
	[key: string]: any;
}
