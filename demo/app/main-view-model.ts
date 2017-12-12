import { Observable } from 'tns-core-modules/data/observable';
import { CopyFilesystem } from 'nativescript-copy-filesystem';

export class HelloWorldModel extends Observable {
  public message: string;
  private copyFilesystem: CopyFilesystem;

  constructor() {
    super();

    this.copyFilesystem = new CopyFilesystem();
    this.message = this.copyFilesystem.message;
  }
}
