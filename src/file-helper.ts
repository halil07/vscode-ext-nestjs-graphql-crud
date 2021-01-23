import {
  window,
  Uri,
  workspace,
  WorkspaceEdit,
  Position,
  commands,
  FileType,
} from "vscode";
import { render } from "mustache";
import {
  getPascalCase,
  getRelativePathForImport,
  getArraySchematics,
  getLineNoFromString,
  getClassName,
  getCamelCase,
} from "./utils";
import * as fs from "fs-extra";
import { join, basename } from "path";
import { TextEncoder, TextDecoder } from "util";
import { NestFile, generatedFilesType } from "./nest";

export async function createFiles(file: NestFile) {
  if (
    fs.existsSync(
      join(file.uri.fsPath, file.name.toLowerCase() + `.${file.type}.ts`)
    )
  ) {
    return window.showErrorMessage("A file already exists with given name");
  } else {
    const stats = await workspace.fs.stat(file.uri);

    if (stats.type !== FileType.Directory) {
      return window.showErrorMessage("Should be Directory");
    }
    const generatedFiles: Promise<generatedFilesType>[] = await getFileTemplates(
      file
    );
    generatedFiles.forEach((f) => f.then((a) => createGeneratedFile(a)));
  }
}
export async function getFileTemplates(file: NestFile) {
  const typeList = JSON.parse(
    await fs.readFileSync(
      join(__dirname, `./templates/generateGraphQL.json`),
      "utf8"
    )
  );
  const terminal = window.createTerminal(`NestJS Terminal #1 will close`);
  terminal.sendText(`nest generate module ${file.name}`);
  setTimeout(async () => {
    await getFileTemplate(file, "module").then((a) => createGeneratedFile(a));
    terminal.dispose();
  }, 3000);
  return typeList.map(
    async (type: string) => await getFileTemplate(file, type)
  );
}
export async function getFileTemplate(
  file: NestFile,
  type: string
): Promise<generatedFilesType> {
  return fs
    .readFile(
      join(__dirname, `/templates/${file.type}/${type}.mustache`),
      "utf8"
    )
    .then((data) => {
      const nameUpper = getClassName(file.name);
      const nameLower = file.name.toLowerCase();
      return render(data, {
        nameUpper,
        nameLower,
      });
    })
    .then((data) => ({
      text: data.toString(),
      name: file.name,
      fileName: `${file.name}.${type}.ts`,
      uri: file.uri,
    }));
}

export async function createGeneratedFile(file: generatedFilesType) {
  await workspace.fs.writeFile(
    Uri.parse(file.uri + "/" + file.name + "/" + file.fileName),
    new TextEncoder().encode(file.text)
  );
}
