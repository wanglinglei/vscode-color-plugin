// 16进制颜色正则
const hexRegEx = /#(?:[0-9a-fA-F]{6})/g;
// rgb 颜色正则
const rgbRegEX = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?(\s*[\d.]*\s*)?\)/g;
import * as vscode from "vscode";
import { getColorName } from "../lib/utils";
import { window, workspace, Range } from 'vscode';
const fontSize: number = workspace.getConfiguration().get('editor.fontSize') || 16;
/**
 * @description: 创建颜色描述
 * @return {*}
 */
export function createColorDecoration(context:vscode.ExtensionContext) {
  // 创建装饰效果
  const colorNameDecorationType = vscode.window.createTextEditorDecorationType({
    before: {
      width: 'fit-content',
      height: `${fontSize + 4}px`,
      contentText: ' ',
      // border: '1px dashed;border-radius:2px;margin:0 0.2em',
      fontStyle:
        `normal;font-size:${fontSize};line-height:${fontSize + 4}px; vertical-align:middle;padding:0px 5px`,
    },
  });
  // 当前激活的编辑器实例
  let activeEditor = vscode.window.activeTextEditor;


  /**
   * @description: 处理描述数据
   * @param {*} params
   * @return {*}
   */
  function processDecorationData(activeEditor: any, match: any) {
    // 获取匹配结果的起始位置
    const startPos = activeEditor.document.positionAt(match.index);// 开始位置
    const endPos = activeEditor.document.positionAt(match.index + match[0].length);// 结束位置
    const matchColor = match[0];
    const colorName = getColorName(matchColor);
    if (!colorName) { return; };
    // Decoration对象
    const decoration = {
      // 装饰效果的位置
      range: new vscode.Range(startPos, endPos),
      // 鼠标悬停（hover）的提示信息
      hoverMessage:colorName? `${colorName} ${match[0]}`:'',
      renderOptions: {
        before: {
          color: 'white',
          contentText: colorName,
          backgroundColor: 'green',
          borderColor: 'red',
        },
      },
    };
    return decoration;
  }


  function updateDecorations() {
    if (!activeEditor) {
      return;
    }
    // 获取文档的文本
    const text = activeEditor.document.getText();
    // 装饰效果数组，用于归集每一个Decoration对象
    const colorDecorations: vscode.DecorationOptions[] = [];
    let match;
    while ((match = hexRegEx.exec(text))) {

      const decoration = processDecorationData(activeEditor, match);
      if (decoration) {
        colorDecorations.push(decoration);
      }

    }
    while (match = rgbRegEX.exec(text)) {

      const decoration = processDecorationData(activeEditor, match);
      if (decoration) {
        colorDecorations.push(decoration);
      }
    }
    console.log('colorDecorations', colorDecorations);

    // 添加装饰效果
    activeEditor.setDecorations(colorNameDecorationType, colorDecorations);
  }
  // 给方法节流
  let timeout: NodeJS.Timer | undefined = undefined;
  function triggerUpdateDecorations(throttle = false) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    if (throttle) {
      timeout = setTimeout(updateDecorations, 500);
    } else {
      updateDecorations();
    }
  }

  if (activeEditor) {
    triggerUpdateDecorations();
  }
  window.onDidChangeActiveTextEditor(
    (currentEditor) => {
      activeEditor = currentEditor;
      if (activeEditor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  workspace.onDidChangeTextDocument(
    // @ts-ignore
    triggerUpdateDecorations,
    null,
    context.subscriptions
  );
}

