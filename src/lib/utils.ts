
/**
 * @description: 将rgb list 输出成rgb string
 * @param {number} list
 * @return {*}
 */
export function processRgbColor(list: number[]): string {
  if (!list.length) { return ''; }
  const colorString: string = list.join(',');
  return `rgb(${colorString})`;
}

import { colorList } from "./constants";
/**
 * @description: 获取颜色的中文名
 * @param {string} color
 * @return {*}
 */
export function getColorName(color: string): string {
  if (!color) { return ""; }
  if (color.includes("rgb")) {
    const rgbNumberString=color.replace("rgb", "").replace("(", "").replace(")", "").replace(" ","");
    const colorItem = colorList.find(item => {
      return item.rgb.join(',') ===rgbNumberString;
    });
    if (colorItem) { return colorItem.name; }
    else {
      return '';
    }
  } else {
    const colorItem = colorList.find(item => {
      return item.hex === color.toLowerCase();
    });
    if (colorItem) { return colorItem.name; }
    else {
      return '';
    }
  }
}