import {Observable} from 'tns-core-modules/data/observable';
import {CopyFilesystem, VersionNumber} from 'nativescript-copy-filesystem';

import * as fs from 'tns-core-modules/file-system';
import * as application from 'tns-core-modules/application';

export class HelloWorldModel extends Observable {
	private copyFilesystem: CopyFilesystem;
	private versionNumber: VersionNumber;
	public message: string;

	constructor() {
		super();

		this.copyFilesystem = new CopyFilesystem();

		this.versionNumber  = new VersionNumber();		
		this.message = this.versionNumber.get();

		if (!application.ios) {
			this.copyFilesystem.hasPermission_external_storage()

			let downloads_path = fs.path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).toString());
			let dcim_path = fs.path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).toString());
			// var ringtones_path = fs.path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_RINGTONES).toString());
			// var movie_path = fs.path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_MOVIES).toString());

			let folder = fs.Folder.fromPath(downloads_path);

			//Legt Dateien neu an falls nicht vorhanden
			let test_txt = folder.getFile('test.txt');
			let test_svg = folder.getFile('typescript_img.svg');
			let test_png = folder.getFile('img_80.png');


			// Test file Copy
			// console.log("Test file Copy");
			// this.copyFilesystem.copy(test_png.path, downloads_path, 'kopie')

			// Test folder copy
			// console.log('Test folder copy');
			this.copyFilesystem.copy(downloads_path, dcim_path, 'copy')
			
			this.copyFilesystem.log_FolderEntities(dcim_path)

			let dcim = dcim_path + '/Download_copy(2)'
			let folder_dcim = fs.Folder.fromPath(dcim);

			console.log('Folder to delete: ' + folder_dcim.path + folder_dcim.name)

			// Remove a folder and recursively its content.
			folder_dcim.remove()
				.then(function (result) {
					// Success removing the folder.
					console.log('Success removing the folder.')
				}, function (error) {
					// Failed to remove the folder.
					console.log('Failed to remove the folder.')
				});
		}

		if (application.ios) {
			let doc_folder = fs.knownFolders.documents();
			console.log(
				'1| doc_folder.path: ' + doc_folder.path + '\n', 
				'1| doc_folder.name: ' + doc_folder.name + '\n')


			let doc_parent = doc_folder.parent
			console.log(
				'2| doc_parent.path: ' + doc_parent.path + '\n', 
				'2| doc_parent.name: ' + doc_parent.name + '\n')

			let doc_parent_parent = doc_parent.parent
			console.log(
				'3| doc_parent_parent.path: ' + doc_parent_parent.path + '\n', 
				'3| doc_parent_parent.name: ' + doc_parent_parent.name + '\n')
			
			//Test erreichbare tiefe
			let doc_parent_parent_parent = doc_parent_parent.parent
			console.log(
				'4| doc_parent_parent_parent.path: ' + doc_parent_parent_parent.path + '\n', 
				'4| doc_parent_parent_parent.name: ' + doc_parent_parent_parent.name + '\n')
			
			//Test erreichbare tiefe
			let doc_parentx4 = doc_parent_parent_parent.parent
			console.log(
				'5| doc_parentx4.path: ' + doc_parentx4.path + '\n', 
				'5| doc_parentx4.name: ' + doc_parentx4.name + '\n')

							//Test erreichbare tiefe
			let doc_parentx5 = doc_parentx4.parent
			console.log(
				'6| doc_parentx5.path: ' + doc_parentx5.path + '\n', 
				'6| doc_parentx5.name: ' + doc_parentx5.name + '\n')

			this.copyFilesystem.log_FolderEntities(doc_parentx5.path)
			
			//Test erreichbare tiefe
			let doc_parentx6 = doc_parentx5.parent
			console.log(
				'7| doc_parentx6.path: ' + doc_parentx6.path + '\n', 
				'7| doc_parentx6.name: ' + doc_parentx6.name + '\n')
							
			this.copyFilesystem.log_FolderEntities(doc_parentx6.path)
			/*
			let path = fs.path.join(doc_folder.path, "test.txt");
			let file = fs.File.fromPath(path);

			console.log('test.txt| path: ' + path, ' file.path: ' + file.path, ' file.name: ' + file.name)
			
			//Legt Dateien neu an falls nicht vorhanden
			let test_txt = doc_folder.getFile('test.txt');
			let test_svg = doc_folder.getFile('typescript_img.svg');
			let test_png = doc_folder.getFile('img_80.png');


			// Test file Copy
			// console.log("Test file Copy");
			this.copyFilesystem.copy(test_png.path, doc_folder.path, 'kopie')

			// Test folder copy
			// console.log('Test folder copy');
			// this.copyFilesystem.copy(doc_folder.path, doc_folder.path, 'copy')
			*/
		}
	}
}