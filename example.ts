import { fetchCitationResults } from "./src/client";
import {
	ScriptureSourceFlag,
	TalksCitationIndexQuery,
	TalkSourceFlag,
	type ScripturesCitationIndexQuery,
} from "./src/types";

async function exampleScripturesSearch() {
	const query: ScripturesCitationIndexQuery = {
		tab: "s",
		sources: [
			ScriptureSourceFlag.NewTestament,
			ScriptureSourceFlag.BookOfMormon,
		],
		sort: "r",
		pageSize: 30,
		offset: 0,
		query: "faith+ hope+ charity+",
	};
	const result = await fetchCitationResults(query);
	return result;
}

async function exampleTalksSearch() {
	const query: TalksCitationIndexQuery = {
		tab: "t",
		startYear: 2000,
		endYear: 2025,
		sources: [TalkSourceFlag.GeneralConference],
		sort: "r",
		pageSize: 30,
		offset: 0,
		query: "faith",
	};
	const result = await fetchCitationResults(query);
	return result;
}

async function main() {
	const scripturesResult = await exampleScripturesSearch();
	const talksResult = await exampleTalksSearch();
	// console.log(scripturesResult);
	console.log(talksResult);
}

main();
