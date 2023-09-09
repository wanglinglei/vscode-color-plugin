import * as vscode from "vscode";
import { workspace, CompletionItemKind } from "vscode";
import { colorList, IColor } from "./lib/constants";

const isRgb = workspace.getConfiguration().RGB;

export function activate(context: vscode.ExtensionContext) {
	const cc = vscode.languages.registerCompletionItemProvider(
		[
			"css",
			"scss",
			"sass",
			"less",
			"stylus",
			"html",
			"xml",
			"json",
			"javascript",
			"typescript",
			"javascriptreact",
			"typescriptreact",
			"vue",
			"vue-html",
		],// activationEvents
		{
			//@ts-ignore
			provideCompletionItems() {
				const list = [] as CompletionItemKind[];

				colorList.forEach((color: IColor) => {
					const {rgb,hex,name,pinyin}=color;
					//@ts-ignore
					list.push({
						detail: isRgb ? rgb : hex,
						documentation: color.name,
						kind: CompletionItemKind.Color,
						filterText: "#" + name + pinyin,
						label: name,
						insertText: isRgb ? rgb : hex,
					});
				});
				return list;
			},
		},
		"#"
	);
	context.subscriptions.push(cc);
}

export function deactivate() { }
