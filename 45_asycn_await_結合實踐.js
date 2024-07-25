/* 
讀取 resource 1.html 2.html 3.html 文件內容
*/

// 使用回調函數的方式來實現
const fs = require("fs");
// 使用 util.promisify 將 fs.readFile 轉換成 promise 對象
const util = require("util");
const mainReadFile = util.promisify(fs.readFile);

// fs.readFile("./resource/1.html", (err, data1) => {
//   if (err) throw err;
//   fs.readFile("./resource/2.html", (err, data2) => {
//     if (err) throw err;
//     fs.readFile("./resource/3.html", (err, data3) => {
//       if (err) throw err;
//       console.log(data1 + data2 + data3);
//     });
//   });
// });

// 使用 async await 的方式來實現
async function main() {
  try {
    // 讀取第一個文件的內容
    let data1 = await mainReadFile("./resource/1.html");
    let data2 = await mainReadFile("./resource/2.html");
    let data3 = await mainReadFile("./resource/3.html");
    console.log(data1 + data2 + data3);
  } catch (error) {
    console.log(error.code);
  }
}

main();

