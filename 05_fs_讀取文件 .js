// 引入 fs 模組
const fs = require('fs');

// callback 寫法
// // 第一個參數是文件路徑 第二個參數是回調函數
// fs.readFile('./resource/content.txt', (err, data) => {
//   // 拋出異常
//   if (err) throw err;
//   // 輸出文件內容 不加上 toString() 會輸出 Buffer
//   console.log(data.toString());
// });

// Promise 寫法
let p = new Promise((resolve, reject) => {
  fs.readFile('./resource/content.txt', (err, data) => {
    // 如果出錯
    if (err) reject(err);
    // 如果成功
    resolve(data);
  });
});

// 調用 then
p.then(value => {
  console.log(value.toString());
}, reason => {
  console.log(reason);
});

// 路徑錯誤(故意副檔名寫錯 './resource/content.tx')可打印出錯誤信息如如下：
// [Error: ENOENT: no such file or directory, open 'D:\最近程式練習\尚硅谷\Promise\resource\content.tx'] {
//   errno: -4058,
//   code: 'ENOENT',
//   syscall: 'open',
//   path: 'D:\\最近程式練習\\尚硅谷\\Promise\\resource\\content.tx'
// }
