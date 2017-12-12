import { Common } from './copy-filesystem.common';
export declare class CopyFilesystem extends Common {
  // define your typings manually
  // or..
  // take the ios or android .d.ts files and copy/paste them here

	copy(current_path: string, destionation_path: string, file_ending: any);
  
    hasPermission_external_storage();
    
    log_FolderEntities(log_FolderEntities: string)
}
