/**
 * Helpers for pagination logic for the Citation Index API.
 */

export function getNextOffset(currentOffset: number, pageSize: number): number {
	return currentOffset + pageSize;
}

export function getPrevOffset(currentOffset: number, pageSize: number): number {
	return Math.max(0, currentOffset - pageSize);
}
