class Promise {
  // 購構造函數
  constructor(executor) {
    // 同步調用「執行器函數」
    // 添加「狀態」和「結果」屬性
    this.PromiseState = "pending";
    this.PromiseResult = null;
    // 聲明一個屬性來保存回調函數
    this.callbacks = [];

    // 保存實例對象的 this 的值
    const self = this; // 名稱可以自己定義，常見的有 that、_this、self

    // 定義 resolve 函數
    function resolve(data) {
      // console.log(this); // 直接調用 this 會指向 window
      // 判斷
      if (self.PromiseState !== "pending") return;
      // 1. 修改對象狀態 (promiseState)
      self.PromiseState = "fulfilled"; // resolved 成功的意思
      // 2. 設置對象結果值 (promiseResult)
      self.PromiseResult = data;
      // 調用成功的回調函數
      // if (self.callback.onResolved) {
      //   self.callback.onResolved(data);
      // }
      // 遍歷 callbacks 調用所有成功的回調函數
      setTimeout(() => {
        self.callbacks.forEach((item) => {
          item.onResolved(data);
        });
      });
    }

    // 定義 reject 函數
    function reject(data) {
      // 判斷
      if (self.PromiseState !== "pending") return;
      // 1. 修改對象狀態 (promiseState)
      self.PromiseState = "rejected";
      // 2. 設置對象結果值 (promiseResult)
      self.PromiseResult = data;
      // 調用成功的回調函數
      // if (self.callback.onRejected) {
      //   self.callback.onRejected(data);
      // }
      // 遍歷 callbacks 調用所有失敗的回調函數
      setTimeout(() => {
        self.callbacks.forEach((item) => {
          item.onRejected(data);
        });
      });
    }
    // 使用 try...catch 捕獲執行器函數的異常, 才能處理 throw 的異常
    try {
      executor(resolve, reject);
    } catch (e) {
      // 修改 promise 狀態為「失敗」
      reject(e);
    }
  }

  // then 方法封裝
  then(onResolved, onRejected) {
    // 保存實例對象的 this 的值
    const self = this;
    // 判斷回調函數的參數，為了將值傳遞下去，最後由 catch 方法接收
    if (typeof onRejected !== "function") {
      onRejected = (reason) => {
        throw reason;
      };
    }
    if (typeof onResolved !== "function") {
      onResolved = (value) => value;
      // 簡寫 等同於
      // value => {return value;}
      // onResolved = function (value) {
      //   return value;
      // };
    }
    // 調用 then 方法時，返回一個新的 Promise 對象，不然會是 undefined
    return new Promise((resolve, reject) => {
      // 封裝函數
      function callback(type) {
        try {
          // 獲取回調函數的執行結果
          let result = type(self.PromiseResult);
          // 判斷 result 的值
          if (result instanceof Promise) {
            // 如果 result 是 Promise 對象
            result.then(
              (v) => {
                resolve(v);
              },
              (r) => {
                reject(r);
              }
            );
          } else {
            // 結果的對象狀態是「成功」
            resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      }

      // 調用回調函數 PromiseState
      if (this.PromiseState === "fulfilled") {
        // 使用定時器是為了保證能夠非同步調用
        setTimeout(() => {
          callback(onResolved);
        });
      }
      if (this.PromiseState === "rejected") {
        // 使用定時器是為了保證能夠非同步調用
        setTimeout(() => {
          callback(onRejected);
        });
      }
      // 判斷 pending 狀態 (為了非同步能夠調用)
      if (this.PromiseState === "pending") {
        // 保存回調函數 這很重要！！！
        this.callbacks.push({
          onResolved: function () {
            callback(onResolved);
          },
          onRejected: function () {
            callback(onRejected);
          },
          // 簡寫
          // onResolved,
          // onRejected,
        });
      }
    });
  }

  // catch 方法封裝
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  // resolve 方法封裝，屬於類，不屬於實例對象，所以使用 static 關鍵字來進行描述
  static resolve(value) {
  // 返回 Promise 對象
  return new Promise((resolve, reject) => {
    if(value.instanceof === Promise) {
      value.then(v => {
        resolve(v);
      }, r => {
        reject(r);
      });
    }else {
      // 狀態設置為成功
      resolve(value);
    }
  });
  };

  // reject 方法封裝
  static reject(reason) {
    // 返回 Promise 對象
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  };

  // all 方法封裝
  static all(promises) {
  // 返回結果為 promise 對象
  return new Promise((resolve, reject) => {
    // 宣告變數
    let count = 0;
    let arr = [];
    // 遍歷
    for(let i = 0 ; i < promises.length; i ++) {
      // 其中一個 promise 對象所以可以調用 then 方法
      promises[i].then(v => {
        // 得知狀態的對象是成功的
        count ++;
        // 每個 promise 對象都成功才算成功
        // 將當前 promise 對象成功的結果存入陣列當中
        arr[i] = v;
        // 判斷
        if(count === promises.length) {
          // 修改狀態
          resolve(arr);
        }
      }, r => {
        reject(r);
      });
    }
  });
  };

  // race 方法封裝
  static race(promises) {
  return new Promise((resolve, reject) => {
    for(let i = 0; i < promises.length; i ++) {
      promises[i].then(v => {
        // 修改返回對象的狀態為 「成功」
        resolve(v);
      }, r => {
        // 修改返回對象的狀態為 「失敗」
        reject(r);
      });
    }
  });
};

}

// function Promise(executor) {
//   // 同步調用「執行器函數」
//   // 添加「狀態」和「結果」屬性
//   this.PromiseState = 'pending';
//   this.PromiseResult = null;
//   // 聲明一個屬性來保存回調函數
//   this.callbacks = [];

//   // 保存實例對象的 this 的值
//   const self = this; // 名稱可以自己定義，常見的有 that、_this、self

//   // 定義 resolve 函數
//   function resolve(data) {
//     // console.log(this); // 直接調用 this 會指向 window 
//     // 判斷
//     if (self.PromiseState !== 'pending') return;
//     // 1. 修改對象狀態 (promiseState)
//     self.PromiseState = 'fulfilled'; // resolved 成功的意思
//     // 2. 設置對象結果值 (promiseResult)
//     self.PromiseResult = data;
//     // 調用成功的回調函數
//     // if (self.callback.onResolved) {
//     //   self.callback.onResolved(data);
//     // }
//     // 遍歷 callbacks 調用所有成功的回調函數
//     setTimeout(() => {
//       self.callbacks.forEach(item => {
//         item.onResolved(data);
//       });
//     });
//   }

//   // 定義 reject 函數
//   function reject(data) {
//     // 判斷
//     if (self.PromiseState !== "pending") return;
//     // 1. 修改對象狀態 (promiseState)
//     self.PromiseState = "rejected";
//     // 2. 設置對象結果值 (promiseResult)
//     self.PromiseResult = data;
//     // 調用成功的回調函數
//     // if (self.callback.onRejected) {
//     //   self.callback.onRejected(data);
//     // }
//     // 遍歷 callbacks 調用所有失敗的回調函數
//     setTimeout(() => {
//       self.callbacks.forEach((item) => {
//         item.onRejected(data);
//       });
//     });
//   }
//   // 使用 try...catch 捕獲執行器函數的異常, 才能處理 throw 的異常
//   try {
//     executor(resolve, reject);
//   } catch (e) {
//     // 修改 promise 狀態為「失敗」
//     reject(e);
//   }
// }

// 添加 then 方法
// Promise.prototype.then = function(onResolved, onRejected) {
//   // 保存實例對象的 this 的值
//   const self = this;
//   // 判斷回調函數的參數，為了將值傳遞下去，最後由 catch 方法接收
//   if(typeof onRejected !== 'function') {
//     onRejected = reason => {
//       throw reason;
//     }
//   }
//   if(typeof onResolved !== 'function') {
//     onResolved = value => value;
//     // 簡寫 等同於 
//     // value => {return value;}
//     // onResolved = function (value) {
//     //   return value;
//     // };
//   }
//   // 調用 then 方法時，返回一個新的 Promise 對象，不然會是 undefined
//   return new Promise((resolve, reject) => {


//     // 封裝函數
//     function callback(type) {
//       try {
//         // 獲取回調函數的執行結果
//         let result = type(self.PromiseResult);
//         // 判斷 result 的值
//         if (result instanceof Promise) {
//           // 如果 result 是 Promise 對象
//           result.then(
//             (v) => {
//               resolve(v);
//             },
//             (r) => {
//               reject(r);
//             }
//           );
//         } else {
//           // 結果的對象狀態是「成功」
//           resolve(result);
//         }
//       } catch (e) {
//         reject(e);
//       }
//     }


//     // 調用回調函數 PromiseState
//     if (this.PromiseState === "fulfilled") {
//       // 使用定時器是為了保證能夠非同步調用
//       setTimeout(() => {
//         callback(onResolved);
//       });
//     }
//     if (this.PromiseState === "rejected") {
//       // 使用定時器是為了保證能夠非同步調用
//       setTimeout(() => {
//         callback(onRejected);
//       });
//     }
//     // 判斷 pending 狀態 (為了非同步能夠調用)
//     if (this.PromiseState === "pending") {
//       // 保存回調函數 這很重要！！！
//       this.callbacks.push({
//         onResolved: function() {
//           callback(onResolved);
//         },
//         onRejected: function() {
//           callback(onRejected);
//         }
//         // 簡寫
//         // onResolved,
//         // onRejected,
//       });
//     }
//   });
// }

// 添加 catch 方法
// Promise.prototype.catch = function(onRejected) {
//   return this.then(undefined, onRejected);
// }

// 添加 resolve 方法
// 是函數對象，不是實例對象
// Promise.resolve = function(value) {
//   // 返回 Promise 對象
//   return new Promise((resolve, reject) => {
//     if(value.instanceof === Promise) {
//       value.then(v => {
//         resolve(v);
//       }, r => {
//         reject(r);
//       });
//     }else {
//       // 狀態設置為成功
//       resolve(value);
//     }
//   });
// };

// 添加 reject 方法
// Promise.reject = function(reason) {
//   // 返回 Promise 對象
//   return new Promise((resolve, reject) => {
//     reject(reason);
//   });
// };

// 添加 all 方法
// Promise.all = function(promises) {
//   // 返回結果為 promise 對象
//   return new Promise((resolve, reject) => {
//     // 宣告變數
//     let count = 0;
//     let arr = [];
//     // 遍歷
//     for(let i = 0 ; i < promises.length; i ++) {
//       // 其中一個 promise 對象所以可以調用 then 方法
//       promises[i].then(v => {
//         // 得知狀態的對象是成功的
//         count ++;
//         // 每個 promise 對象都成功才算成功
//         // 將當前 promise 對象成功的結果存入陣列當中
//         arr[i] = v;
//         // 判斷
//         if(count === promises.length) {
//           // 修改狀態
//           resolve(arr);
//         }
//       }, r => {
//         reject(r);
//       });
//     }
//   });
// };

// 添加 race 方法
// Promise.race = function(promises) {
//   return new Promise((resolve, reject) => {
//     for(let i = 0; i < promises.length; i ++) {
//       promises[i].then(v => {
//         // 修改返回對象的狀態為 「成功」
//         resolve(v);
//       }, r => {
//         // 修改返回對象的狀態為 「失敗」
//         reject(r);
//       });
//     }
//   });
// };