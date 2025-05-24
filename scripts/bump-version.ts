#!/usr/bin/env bun
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface PackageJson {
	version: string;
	[key: string]: any;
}

type VersionType = "major" | "minor" | "fix";

class VersionUpdater {
	private packagePath: string;
	private dryRun: boolean;

	constructor(packagePath: string, dryRun: boolean = false) {
		this.packagePath = packagePath;
		this.dryRun = dryRun;
	}

	private readPackageJson(): PackageJson {
		const content = fs.readFileSync(this.packagePath, "utf-8");
		return JSON.parse(content);
	}

	private writePackageJson(data: PackageJson): void {
		if (!this.dryRun) {
			fs.writeFileSync(
				this.packagePath,
				JSON.stringify(data, null, 2) + "\n"
			);
		}
	}

	private execCommand(command: string): void {
		if (this.dryRun) {
			console.log(`[DRY RUN] Would execute: ${command}`);
		} else {
			execSync(command, { stdio: "inherit" });
		}
	}

	private bumpVersion(currentVersion: string, type: VersionType): string {
		const [major, minor, fix] = currentVersion.split(".").map(Number) as [
			number,
			number,
			number
		];

		switch (type) {
			case "major":
				return `${major + 1}.0.0`;
			case "minor":
				return `${major}.${minor + 1}.0`;
			case "fix":
				return `${major}.${minor}.${fix + 1}`;
			default:
				throw new Error(`Invalid version type: ${type}`);
		}
	}

	public update(type: VersionType): void {
		console.log(
			`${this.dryRun ? "[DRY RUN] " : ""}Updating version (${type})...`
		);

		const packageJson = this.readPackageJson();
		const currentVersion = packageJson.version;
		const newVersion = this.bumpVersion(currentVersion, type);

		console.log(`Current version: ${currentVersion}`);
		console.log(`New version: ${newVersion}`);

		// Update package.json
		packageJson.version = newVersion;
		this.writePackageJson(packageJson);

		// Git commands
		this.execCommand("git add package.json");
		this.execCommand(
			`git commit -m "chore: bump version to ${newVersion}"`
		);
		this.execCommand(
			`git tag -a v${newVersion} -m "Release version ${newVersion}"`
		);
		this.execCommand("git push");
		this.execCommand("git push --tags");

		console.log(
			`${this.dryRun ? "[DRY RUN] " : ""}Version update complete!`
		);
	}
}

function main() {
	const args = process.argv.slice(2);
	const versionType = args[0] as VersionType;
	const dryRun = args.includes("--dry-run");

	if (!["major", "minor", "fix"].includes(versionType)) {
		console.error("Usage: version.ts <major|minor|fix> [--dry-run]");
		process.exit(1);
	}

	const packagePath = path.resolve(process.cwd(), "package.json");
	const updater = new VersionUpdater(packagePath, dryRun);

	try {
		updater.update(versionType);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

main();
