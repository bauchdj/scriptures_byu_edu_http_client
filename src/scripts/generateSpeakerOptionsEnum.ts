import { load } from "cheerio";
import fs from "fs";
import path from "path";

async function getSpeakerOptions(url: string): Promise<string[]> {
	try {
		const response = await fetch(url);
		if (!response.ok)
			throw new Error(`Failed to fetch: ${response.statusText}`);

		const html = await response.text();
		const $ = load(html);

		const options: string[] = [];

		$("#speakerSearch option").each((_, el) => {
			const value = $(el).attr("value");
			if (value !== undefined && value !== "" && value !== "Any") {
				options.push(value);
			}
		});

		return options;
	} catch (err) {
		console.error("Error:", err);
		return [];
	}
}

function generateSpeakerOptionsEnum(speakerOptionValues: string[]) {
	let enumString = "export enum Speakers {\n";
	const speakerNames = new Set<string>();
	const speakerNameCount = new Map<string, number>();
	for (const value of speakerOptionValues) {
		if (value.includes("--")) {
			const rawSpeakerName = value.split("--")[1];
			const sanitizedSpeakerName = rawSpeakerName
				.replace(/\(.*\)/g, "")
				.replace(/\W+/g, "");

			const count = speakerNameCount.get(sanitizedSpeakerName) || 0;
			const newCount = count + 1;
			speakerNameCount.set(sanitizedSpeakerName, newCount);
			let updatedSpeakerName = sanitizedSpeakerName;
			if (count > 0) {
				updatedSpeakerName += `_${newCount}`;
			}
			speakerNames.add(updatedSpeakerName);

			const newEnumLine = `${updatedSpeakerName} = "${value}",`;
			enumString += `\t${newEnumLine}\n`;
		} else {
			console.error(`Invalid value: ${value}`);
		}
	}
	enumString += "}";
	return enumString;
}

async function main() {
	const url = "https://scriptures.byu.edu/citation_index/search_ajax/";
	const speakerOptionValues = await getSpeakerOptions(url);
	const enumString = generateSpeakerOptionsEnum(speakerOptionValues);
	const outputPath = path.join(__dirname, "../types/speakers.ts");
	await fs.promises.writeFile(outputPath, enumString);
	console.log(`Speaker options enum generated at ${outputPath}`);
}

main();
