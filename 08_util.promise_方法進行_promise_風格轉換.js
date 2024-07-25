/* 
util.promisify() 方法進行 promise 風格轉換
*/
// 引入 util 模組
const util = require('util');
// 引入 fs 模組
const fs = require('fs');
// 返回一個新的函數
let mineReadFile = util.promisify(fs.readFile);

mineReadFile('./resource/content.txt').then(value => {
  console.log(value.toString());
}, reason => {
  console.log('讀取文件失敗', reason);
})

