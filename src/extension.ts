import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('sv-instance-generator.instance', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('エディタが開かれていません。');
      return;
    }
    const document = editor.document;
    const code = document.getText();

    try {
      const instanceCode = generateInstanceFromSV(code);
      // クリップボードにコピー
      await vscode.env.clipboard.writeText(instanceCode);
      vscode.window.showInformationMessage('インスタンス化コードをクリップボードにコピーしました。');
    } catch (error: any) {
      vscode.window.showErrorMessage(error.message);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

/**
 * SystemVerilog のコードからモジュール定義を抽出し、
 * インスタンス化コードを生成して返す。
 */
function generateInstanceFromSV(code: string): string {
  // コメント除去: シングルラインとブロックコメント
  code = removeComments(code);

  const { modName, portListStr } = extractModuleInfo(code);
  const ports = parsePorts(portListStr);
  const instanceCode = generateInstance(modName, ports);
  return instanceCode;
}

/**
 * シングルライン（//）およびブロックコメント（/* ... *​/）を除去する。
 */
function removeComments(code: string): string {
  // シングルラインコメント
  code = code.replace(/\/\/.*$/gm, '');
  // ブロックコメント（非貪欲マッチ）
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  return code;
}

/**
 * ANSIスタイルの module 宣言からモジュール名と括弧内ポートリストを抽出する。
 * 例: module my_module ( ... );
 */
function extractModuleInfo(code: string): { modName: string, portListStr: string } {
  const modRegex = /\bmodule\s+(\w+)\s*\(([\s\S]*?)\)\s*;/;
  const match = modRegex.exec(code);
  if (!match) {
    throw new Error('module定義が見つかりませんでした。');
  }
  const modName = match[1];
  const portListStr = match[2];
  return { modName, portListStr };
}

/**
 * 括弧内のポート定義文字列から、カンマ区切りで各ポート定義を抽出し、
 * 各定義の最後のトークンをポート名として返す。
 */
function parsePorts(portListStr: string): string[] {
  const ports: string[] = [];
  // カンマ区切りで分割し、余計な空白を除去
  const portEntries = portListStr.split(',')
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0);

  for (const entry of portEntries) {
    const tokens = entry.split(/\s+/);
    if (tokens.length === 0) {
      continue;
    }
    // 最後のトークンがポート名。末尾の不要な記号も除去する。
    let portName = tokens[tokens.length - 1].replace(/[);]/g, '');
    ports.push(portName);
  }
  return ports;
}

/**
 * インスタンス化コードを生成する。
 *
 * 生成例:
 *   my_module u_my_module (
 *     .clk      (),
 *     .rst_n    (),
 *     .data_out ()
 *   );
 *
 * 条件:
 * - インスタンス名は u_[module名]
 * - ポートの順序は module 定義の順番そのまま
 * - インデントはスペース2個
 * - 各ポート行は「.<port名><パディング> ()」とし、一番長いポート名に合わせて()の位置を揃える
 */
function generateInstance(modName: string, ports: string[]): string {
  // 最大ポート名の長さを取得
  const maxPortLength = ports.reduce((max, p) => Math.max(max, p.length), 0);
  const lines: string[] = [];
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
