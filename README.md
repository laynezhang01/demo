# React Questions

## Question 1 定義request

`src/api` 目錄下的文件均為後端生成的，現需定義 `src/core/request` 中的實例以滿足 `src/api/interface` 下的接口請求

該request實例基於axios拓展，令到`queryParams`,`pathVariables`,`body`,`response`都擁有類型，`ignoreAuth`欄位決定請求是否需要帶token，透過`silentError`和`throwError`欄位決定請求失敗的處理方式


### 要求
- 管理token 包括token的取得、持久化、刷新、刪除，對應接口在 `src/api/interface/auth.ts` 
- 定義請求失敗的默認行為，暫定為彈出toast。該行為需抽象出interface以適配任何ui框架