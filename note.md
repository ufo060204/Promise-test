# 筆記

## 非同步編成
### 傳統方式用 callback function 來解決，如下：
* fs 文件操作
```
require('fs').readFile('./index.html', (err, data) => {})
```
* 數據庫操作
*AJAX
```
$.get('/server', (data) => {})
```
* 定時器
```
setTimeout(() => {}, 200)
```
### 為何要使用 promise？
* 支持鍊式調用，可以解決回調地獄
* 指定回調的方式更為靈活

## Promise 的狀態
實例對象中的一個屬性 [PromiseState]
* pending 未決定(初始化默認值)
* resolved / fullfilled 成功
* rejected / 失敗

### 狀態改變只能一次，改變方式只有下面兩種
1. pending 變為 resolved
2. pending 變為 rejected
即不可能由成功變失敗, 失敗變成功

## Promise 對象的值
實例對象中的另一個屬性 [PromiseResult]
保存著非同步任務 [成功 / 失敗] 的結果
下面兩個可以已對 PromiseResult 進行修改
* resolve
* reject
