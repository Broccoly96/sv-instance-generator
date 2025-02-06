"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
function activate(context) {
    let disposable = vscode.commands.registerCommand('sv-instance-generator.generateInstance', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No editor is active.');
            return;
        }
        const document = editor.document;
        const code = document.getText();
        try {
            const instanceCode = generateInstanceFromSV(code);
            // Copy to clipboard
            await vscode.env.clipboard.writeText(instanceCode);
            vscode.window.showInformationMessage('Instance code has been copied to the clipboard.');
        }
        catch (error) {
            vscode.window.showErrorMessage(error.message);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
/**
 * Extracts the module definition from SystemVerilog code,
 * generates instance code and returns it.
 */
function generateInstanceFromSV(code) {
    // Remove comments: both single-line and block comments
    code = removeComments(code);
    const { modName, portListStr } = extractModuleInfo(code);
    const ports = parsePorts(portListStr);
    const instanceCode = generateInstance(modName, ports);
    return instanceCode;
}
/**
 * Removes single-line (//) and block (/* ... *​/) comments.
 */
function removeComments(code) {
    // Remove single-line comments
    code = code.replace(/\/\/.*$/gm, '');
    // Remove block comments (non-greedy match)
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    return code;
}
/**
 * Extracts the module name and the port list string from an ANSI-style module declaration.
 * Example: module my_module ( ... );
 */
function extractModuleInfo(code) {
    const modRegex = /\bmodule\s+(\w+)\s*\(([\s\S]*?)\)\s*;/;
    const match = modRegex.exec(code);
    if (!match) {
        throw new Error('Module definition not found.');
    }
    const modName = match[1];
    const portListStr = match[2];
    return { modName, portListStr };
}
/**
 * Parses the port list string by splitting on commas and trimming extra spaces.
 * For each port definition, returns the last token as the port name.
 */
function parsePorts(portListStr) {
    const ports = [];
    // Split by comma and trim extra spaces
    const portEntries = portListStr.split(',')
        .map(entry => entry.trim())
        .filter(entry => entry.length > 0);
    for (const entry of portEntries) {
        const tokens = entry.split(/\s+/);
        if (tokens.length === 0) {
            continue;
        }
        // The last token is considered the port name; remove any trailing characters such as ')' or ';'
        let portName = tokens[tokens.length - 1].replace(/[);]/g, '');
        ports.push(portName);
    }
    return ports;
}
/**
 * Generates the instance code.
 *
 * Example output:
 *   my_module u_my_module (
 *     .clk      (),
 *     .rst_n    (),
 *     .data_out ()
 *   );
 *
 * Conditions:
 * - The instance name is "u_[module name]".
 * - Port order is preserved as defined in the module.
 * - Indentation uses two spaces.
 * - Each port line is formatted as ".<portName><padding> ()", where the padding is adjusted
 *   so that the "()" are aligned based on the longest port name.
 */
function generateInstance(modName, ports) {
    // Get the maximum length among port names
    const maxPortLength = ports.reduce((max, p) => Math.max(max, p.length), 0);
    const lines = [];
    lines.push(`${modName} u_${modName} (`);
    ports.forEach((port, index) => {
        const padLength = (maxPortLength + 1) - port.length;
        const padding = ' '.repeat(padLength);
        const comma = (index < ports.length - 1) ? ',' : '';
        lines.push(`  .${port}${padding} ()${comma}`);
    });
    lines.push(');');
    return lines.join('\n');
}
//# sourceMappingURL=extension.js.map