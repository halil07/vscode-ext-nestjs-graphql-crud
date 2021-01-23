"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const file_helper_1 = require("./file-helper");
const utils_1 = require("./utils");
function activate(context) {
    let disposableModuleCommand = vscode_1.commands.registerCommand("extension.GenerateGraphQL", (resource) => {
        if (vscode_1.workspace === undefined) {
            return vscode_1.window.showErrorMessage("Please select a workspace first");
        }
        else {
            return vscode_1.window
                .showInputBox({
                placeHolder: "Please enter module name",
            })
                .then((input) => {
                if (input === undefined) {
                    return;
                }
                if (!utils_1.invalidFileNames.test(input)) {
                    return file_helper_1.createFiles({
                        name: input.toLowerCase(),
                        type: "GenerateGraphQL",
                        uri: resource,
                    });
                }
                else {
                    return vscode_1.window.showErrorMessage("Invalid filename");
                }
            });
        }
    });
    context.subscriptions.push(disposableModuleCommand);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map