import { Common } from './copy-filesystem.common';

import * as fs from 'tns-core-modules/file-system';
import * as application from 'tns-core-modules/application';

export class CopyFilesystem extends Common {

    public copy(source_path, target_path, ending) {
        if (ending == undefined) {
            ending = 'copy'
        }    
        console.log('Copyfile source_path:' + source_path + ' target path: ' + target_path + ' name extension: ' + ending)
        
        try {
            if (checkIsFile(target_path) == true) {
                console.log(target_path + ' is a file')
                throw new TypeError("Error target path is not a folder");
            }
            if (checkIsFolder(target_path) == false) {
                console.log(target_path + ' not found')
                throw new TypeError("Error target path not found");
            }
            if ((checkIsFile(source_path) == false) && (checkIsFolder(source_path) == false)) {
                console.log(source_path + ' not found,  file: ' + checkIsFile(source_path) + ' folder: '+ checkIsFolder(source_path))
                throw new TypeError("Error copy source_path not found");
            }

            if (checkIsFile(source_path)){
                copyFile(source_path, target_path, ending)
            }else if(checkIsFolder(source_path)){
                copyFolder(source_path, target_path, ending)
            }else{
                throw new TypeError("Error dafuq! how could this happen?");
            }
        } catch (e) {
            console.log(( < Error > e).message);
        }
    }


    /**
     * Alle Dateien im Pfad ausgeben
     * @param source_path Ursprungspfad ohne Datei nur Pfad
     */
    public log_FolderEntities(source_path) {
        console.log('Start log_FolderEntities: ' + source_path)
        var i = 0;
        var old_folder = fs.Folder.fromPath(source_path);

        old_folder.getEntities()
            .then(entities => {
                // entities is array with the document's files and folders.
                entities.forEach(entity => {
                    console.log('log_Entitie: ' + i + ' name: ' + entity.name + ' path: ' + entity.path + " is folder: " + checkIsFolder(entity.path))
                });
                i++;
            }).catch(err => {
                // Failed to obtain folder's contents.
                console.log(err.stack);
            });
    }
}


function checkIsFile(path) {
    // Wirft fehler, folder zählen auch als dateien 
    let exists = fs.File.exists(path);
    let path_split = path.split('/');
    let name = path_split[path_split.length - 1]
    let name_split = name.split('.');
    let name_extension = name_split[name_split.length - 1]

    // console.log('exists path: ' + path + ' ' + exists)
    if ((name_extension !== undefined) && (name_split.length > 1) && (path_split.length > 1) && (exists == true)) {
        //console.log('Path contains a ' + name_extension + ' file , Named: ' + name );
        return true;
    } else {
        //console.log('No file found');
        return false;
    }
}

function checkIsFolder(path) {
    let exists = fs.Folder.exists(path);
    if (exists) {
        //console.log('Path contains a folder: ' + path);
        return true;
    } else {
        //console.log('No folder found');
        return false;
    }
}

/**
 * Kopiert eine Datei
 * @param source_path Ursprungspfad, Datei muss im pfad mit angegben werden 
 * @param target_path Zielpfad ohne Datei
 * @param ending Zusatz Endung am an der neuen
 */
function copyFile(source_path, target_path, ending) {
    console.log('Start copyFile')

    let new_file_name = getNewFileName(source_path, target_path, ending)

    console.log('new file name: ' + new_file_name)
    let sourceFile = fs.File.fromPath(source_path);
    let destinationFile = fs.Folder.fromPath(target_path).getFile(new_file_name);

    console.log('COPYFILE: ' + 'Name: ' + sourceFile.name + ' path: ' + sourceFile.path + " target name: " + destinationFile.name + " target path: " + destinationFile.path)
    let source = sourceFile.readSync(err => {
        console.log('Error:' + err);
    });

    destinationFile.writeSync(source, err => {
        console.log('error destinationFile' + err)
    });
}


/**
 * Kopiert einen Ordner samt unterordernen 
 * @param source_path Ursprungspfad ohne Datei nur Pfad
 * @param target_path Zielpfad ohne Datei nur Pfad
 * @param ending Zusatz Endung am an der neuen
 */
function copyFolder(source_path, target_path, ending) {
    console.log('Start copyFolder')
    var new_folder_name = getNewFolderName(source_path, target_path, ending)

    // console.log('new_folder_name: ' + new_folder_name)
    var new_target_path = fs.path.join(target_path, new_folder_name);
    // console.log('new_target_path: ' + new_target_path)
    var new_folder = fs.Folder.fromPath(new_target_path);
    var old_folder = fs.Folder.fromPath(source_path);

    // console.log(new_folder)
    // console.log(new_folder.path)
    // console.log((fs.Folder.exists(new_folder.path))==true)

    console.log('Start at: ' + old_folder.name + ' path: ' + old_folder.path)
    console.log('Goal at: ' + new_folder.name + ' path: ' + new_folder.path)

    old_folder.getEntities()
        .then(entities => {
            // entities is array with the document's files and folders.
            entities.forEach(entity => {
                if (checkIsFolder(entity.path) == false){
                    console.log('New COPYFILE: ' + 'Name: ' + entity.name + ' path: ' + entity.path + " is folder: " + checkIsFolder(entity.path))
                    copyFile(entity.path, new_target_path, ending)
                }else if (checkIsFolder(entity.path) == true){
                    //rekrusiver Aufruf 
                    console.log('New COPYFOLDER: ' +'Name: ' + entity.name + ' path: ' + entity.path + " is folder: " + checkIsFolder(entity.path))
                    copyFolder(entity.path, new_target_path, ending)
                }
            });
        }).catch(err => {
            // Failed to obtain folder's contents.
            console.log(err.stack);
        });
}

/**
 * sucht neuen Dateinamen im Pfad, der noch nicht existiert
 * @param source_path Ursprungspfad, Datei muss im pfad mit angegben werden 
 * @param target_path Zielpfad ohne Datei
 * @param ending Zusatz Endung am an der neuen
 */
function getNewFileName(source_path, target_path, ending){
    // console.log('   function getNewFileName')
    let target_path_split = target_path.split('/');
    let source_path_split = source_path.split('/');

    // console.log('       target_path: ' + target_path)
    let file_name = source_path_split[source_path_split.length - 1]
    let file_name_split = file_name.split('.');

    var new_file_name = file_name_split[0] + '_' + ending + '.' + file_name_split[1];
    // console.log('       new_file_name: ' + new_file_name)


    let new_target_path = target_path_split.join('/')
    new_target_path = new_target_path + '/' + new_file_name
    
    if (checkIsFile(new_target_path)){
        var i = 1;
        // console.log('       File already exists')
        do{
            new_file_name = file_name_split[0] + '_' + ending + '(' + i + ')' + '.' + file_name_split[1];
            i++;
            // console.log('       new_file_name: ' + new_file_name)
            new_target_path = target_path_split.join('/')
            new_target_path = new_target_path + '/' + new_file_name
            // console.log('       new_target_path: ' + new_target_path + ' checkIsFile(new_target_path): ' + checkIsFile(new_target_path))
        // Suche nach nicht existentem File
        }while (checkIsFile(new_target_path) == true)
    }else if(checkIsFolder(new_target_path)){

    }
    //Es wird nur der Name benötigt
    return new_file_name
}

/**
 * sucht neuen Ordnernamen im Pfad, der noch nicht existiert
 * @param source_path Ursprungspfad ohne Datei nur Pfad
 * @param target_path Zielpfad ohne Datei nur Pfad
 * @param ending Zusatz Endung am an der neuen
 */
function getNewFolderName(source_path, target_path, ending){
    // console.log('   function getNewFolderName')
    let source_path_split = source_path.split('/');
    let folder_name = source_path_split[source_path_split.length - 1]
    var new_target_path = target_path + '/' + folder_name
    var new_folder_name = folder_name;

    if (checkIsFolder(new_target_path) == true){
        var i = 1;
        do{
            new_folder_name = folder_name + '_' + ending + '(' + i + ')'
            // console.log('       new_folder_name: ' + new_folder_name)
            i++;
            new_target_path = target_path + '/' + new_folder_name
            // console.log('       new_target_path: ' + new_target_path + ' checkIsFolder(new_target_path): ' + checkIsFolder(new_target_path))
        // Suche nach nicht existentem File
        }while (checkIsFolder(new_target_path) == true)
    }
    return new_folder_name;
}


export class VersionNumber {
    get() {
      var version = NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleShortVersionString");
      return version;
    }
}