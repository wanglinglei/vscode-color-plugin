

/**
 * @description: 将rgb list 输出成rgb string
 * @param {number} list
 * @return {*}
 */
export function processRgbColor(list:number[]):string{
  if(!list.length) {return '';}
  const colorString:string =list.join(',');
  return `rgb(${colorString})`;
}

