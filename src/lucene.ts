/**
 * Escapes a string for safe use in Lucene queries.
 * See: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Escaping Special Characters
 */
// Escapes only parentheses and brackets for the BYU Citation Index adapted Lucene syntax
export function escapeLuceneQuery(query: string): string {
	return query.replace(/([()\[\]{}])/g, "\\$1");
}

