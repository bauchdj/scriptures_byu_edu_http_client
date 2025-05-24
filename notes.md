# BYU Scripture Citation Index API Reverse Engineering

This document captures insights and structure for building an HTTP client to query the BYU Scripture Citation Index API, which uses the open-source **Lucene** search engine for queries.

## 🔗 Base URL Format

```
https://scriptures.byu.edu/citation_index/search_results_ajax/<tab>&<speaker_id>&<start_year>&<end_year>&<sources>&<sort>&<pagination>@<offset>$<query>
```

## 🧩 URL Segments Explained

| Segment        | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| `<tab>`        | `t` for **Talks**, `s` for **Scriptures**                               |
| `<speaker_id>` | Speaker numeric ID (e.g. `1001` for Angel Abrea), or empty `""` for all |
| `<start_year>` | Starting year of the range (e.g. `1830`)                                |
| `<end_year>`   | Ending year of the range (e.g. `2025`)                                  |
| `<sources>`    | Series of letter flags for content sources (see below)                  |
| `<sort>`       | `r` = Sort by Relevance, `n` = Sort by Name (alphabetical)              |
| `<pagination>` | Number of results per page (`30`)                                       |
| `<offset>`     | Page offset (`0` for first page, increments by `30`)                    |
| `$<query>`     | **Lucene** search query string                                          |

## 🧱 Source Flags

**Talks Tab (`t`)**

-   `g` = General Conference
-   `j` = Journal of Discourses
-   `t` = Scriptural Teachings of the Prophet Joseph Smith

**Scriptures Tab (`s`)**

-   `o` = Old Testament (KJV)
-   `n` = New Testament (KJV)
-   `f` = JST Footnotes
-   `b` = Book of Mormon
-   `d` = Doctrine and Covenants
-   `p` = Pearl of Great Price
-   `j` = Joseph Smith Translation

These can be combined, e.g. `onbdpf`.

## 🔎 Lucene Syntax (for `$<query>`)

Lucene provides powerful query features:

| Feature        | Example                      |
| -------------- | ---------------------------- |
| Keyword        | `test1`                      |
| Boolean        | `faith AND works`            |
| Phrase         | `"Jesus Christ"`             |
| Wildcards      | `test*`, `te?t`              |
| Fuzzy Matching | `repent~`                    |
| Proximity      | `"faith repentance"~5`       |
| Grouping       | `(faith OR works) AND grace` |

Avoid URI encoding Lucene operators (`:`, `"`, `~`, `*`, etc.).

Optional sanitizer for user input:

```ts
function escapeLuceneQuery(query: string): string {
	return query.replace(/([+\-!():^[\]{}"~*?\\/])/g, "\\$1");
}
```

## 🔁 Example Requests

**General Conference only (all speakers):**

```
.../t&&1830&2025&g&r&30@0$test1
```

**General Conference (specific speaker: 1001 - Angel Abrea):**

```
.../t&1001&1830&2025&g&r&30@0$test1
```

**Scriptures (Old & New Testament only):**

```
.../s&on&n&30@0$test1
```

**Scriptures (all sources, relevance sort):**

```
.../s&onfbdpj&r&30@0$test1
```

## ✅ Summary

You can now build a fully functional HTTP client with:

-   Flexible content selection via flags
-   Full-text Lucene search capabilities
-   Speaker filtering
-   Date range filters
-   Pagination and sorting options
