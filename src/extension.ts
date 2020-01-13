// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import REGULARS from './regulars'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-regular-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('regular-helper.search', () => {
		
		// 展示一个快速选择面板
		interface CommandQuickPickItem extends vscode.QuickPickItem {
			regular: RegExp
		}

		let items: CommandQuickPickItem[] = [];
		items = REGULARS.map(item => {
			return {
				label: item.label,
				description: item.type,
				detail: String(item.regular),
				regular: item.regular
			}
		})

		vscode.window.showQuickPick(
			items, 
			{ 
				matchOnDetail: true, 
				matchOnDescription: true,
				placeHolder: '搜索'
			}
		).then(selectedItem => {
			// 选中正则回调
			if (selectedItem) {
				// 插入到文件中
				const editor = vscode.window.activeTextEditor
				if (editor) {
					const { selections } = editor;
					editor.edit(editBuilder => {
						selections.forEach(selection => {
							const { start, end } = selection;
							const range = new vscode.Range(start, end);
							editBuilder.replace(range, String(selectedItem.regular));
						});
					});
					// Display a message box to the user
					vscode.window.showInformationMessage('正则已插入。');
				} else {
					vscode.window.showWarningMessage('只有在编辑文本的时候才可以使用。');
				}
			}
		})
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
