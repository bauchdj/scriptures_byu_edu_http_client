import { test, expect } from "bun:test";
import { buildCitationIndexUrl } from "../urlBuilder";
import { TalkSourceFlag, ScriptureSourceFlag, CitationIndexQuery } from "../types";

test("buildCitationIndexUrl constructs correct URL for Talks", () => {
  const query: CitationIndexQuery = {
    tab: "t",
    speakerId: "1001",
    startYear: 2000,
    endYear: 2025,
    sources: [TalkSourceFlag.GeneralConference],
    sort: "r",
    pageSize: 30,
    offset: 0,
    query: "faith"
  };
  const url = buildCitationIndexUrl(query);
  expect(url).toContain("/t&1001&2000&2025&g&r&30@0$faith");
});

test("buildCitationIndexUrl constructs correct URL for Scriptures", () => {
  const query2: CitationIndexQuery = {
    tab: "s",
    sources: [ScriptureSourceFlag.BookOfMormon, ScriptureSourceFlag.OldTestament],
    query: "Jesus Christ"
  };
  const url2 = buildCitationIndexUrl(query2);
  expect(url2).toContain("/s&&&&bo&r&30@0$Jesus Christ");
});
