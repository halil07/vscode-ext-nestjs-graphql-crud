import { workspace, commands, ExtensionContext, window, Uri } from "vscode";
import { createFiles } from "./file-helper";
import { invalidFileNames } from "./utils";
import { basename } from "path";

export function activate(context: ExtensionContext) {
  let disposableModuleCommand = commands.registerCommand(
    "extension.GenerateGraphQL",
    (resource: Uri) => {
      if (workspace === undefined) {
        return window.showErrorMessage("Please select a workspace first");
      } else {
        return window
          .showInputBox({
            placeHolder: "Please enter module name",
          })
          .then<any>((input) => {
            if (input === undefined) {
              return;
            }
            if (!invalidFileNames.test(input)) {
              return createFiles({
                name: input.toLowerCase(),
                type: "GenerateGraphQL",
                uri: resource,
              });
            } else {
              return window.showErrorMessage("Invalid filename");
            }
          });
      }
    }
  );

  context.subscriptions.push(disposableModuleCommand);
}

export function deactivate() {}
