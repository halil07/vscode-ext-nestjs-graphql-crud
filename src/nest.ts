import { Uri } from "vscode";

export type NestFile = {
  type: string;
  name: string;
  uri: Uri;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export type generatedFilesType = {
  text: string;
  name: string;
  fileName: string;
  uri: Uri;
};
