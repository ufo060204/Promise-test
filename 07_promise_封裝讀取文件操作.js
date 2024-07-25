/* 
* 裝一個函數 mineReadFile 讀取文件內容
* 參數: path 文件路徑
* 返回: promise 對象
*/

function mineReadFile(path) {
  return new Promise((resolve, reject) => {
    require('fs').readFile(path, (err, data) => {
      // 判斷
      if (err) reject(err);
      // 成功
      resolve(data);
    })
  })
}

// 調用
mineReadFile('./resource/content.txt')
.then(value => {
  //輸出文件內容
  console.log(value.toString());
}, reason => {
  console.log('讀取文件失敗', reason);
  }
)