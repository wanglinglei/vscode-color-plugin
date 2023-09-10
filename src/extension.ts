import * as vscode from "vscode";
import { workspace, CompletionItemKind } from "vscode";
import { colorList, IColor } from "./lib/constants";
import { processRgbColor } from "./lib/utils";
import { createColorDecoration } from "./core/decoration";

const isRgb = workspace.getConfiguration().RGB;
export function activate(context: vscode.ExtensionContext) {
	//1.  只对css 文件处理 添加自动补全
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
					const { rgb: rawRgb, hex, name, pinyin } = color;
					const rgb = processRgbColor(rawRgb);
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

	createColorDecoration(context);
}

export function deactivate() { }
