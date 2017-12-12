import { Common } from './copy-filesystem.common';
export declare class CopyFilesystem extends Common {

	copy(current_path: string, destionation_path: string, file_ending: any): void;
    hasPermission_external_storage(): void;
    log_FolderEntities(log_FolderEntities: string): void;
}

export declare class VersionNumber {
	get(): string;
}