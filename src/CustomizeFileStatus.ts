import fs from "fs";

import { CustomizeManifest, CustomizeSetting } from "./KintoneApiClient";
import { isUrlString } from "./util";

interface FileStatus {
  target: "mobile" | "pc";
  type: "js" | "css";
  index: number;
  mtime: number;
  fileKey: string | null;
}

export default class CustomizeFileStatus {
  private fileStatuses: FileStatus[];
  constructor(manifest: CustomizeManifest) {
    this.fileStatuses = [
      ...manifest.desktop.js.map((filePath, index) =>
        this.createFileStatus("pc", "js", index, filePath)
      ),
      ...manifest.desktop.css.map((filePath, index) =>
        this.createFileStatus("pc", "css", index, filePath)
      ),
      ...manifest.mobile.js.map((filePath, index) =>
        this.createFileStatus("mobile", "js", index, filePath)
      )
    ];
    console.log(this.fileStatuses);
  }
  public setFileKey(customizeSetting: CustomizeSetting): void {
    // TODO
  }

  public canSkipUpload(): boolean {
    return false;
  }

  public getFileKey(target: string, type: string, index: number): string {
    return "todo";
  }

  private createFileStatus(
    target: "mobile" | "pc",
    type: "js" | "css",
    index: number,
    filePath: string
  ): FileStatus {
    return {
      target,
      type,
      index,
      mtime: isUrlString(filePath) ? 0 : +fs.statSync(filePath).mtime,
      fileKey: null
    };
  }
}
