# lineSimulator
## GBL lab project 「 超時空會客室 」

模擬跨時空的 line 聊天室

## 功能簡介

每個房間都有各自的代號，因此使用者無需註冊帳號，唯管理者在創立時需要另設密碼

這裡僅作版控

正式網址：https://myheroes.tw/minigames/LineChat/index.php?roomCode=TESTID

測試房號： TESTID

後台網址：https://myheroes.tw/minigames/LineChat/Backstage/index.php

測試房號密碼：1


#### 管理者

可以在後台（Backstage）設立題目、建立角色、上傳角色圖片、設計對話文本

#### 玩家

可以在會客室（Room）閱讀文本、作答


## 主要技術

前端：HTML/JS/scss

後端：php/MySQL

## 特色
- 學生免註冊登入直接使用，節省操作時間
- 提供遊戲化閱讀文本媒介
- 管理者可以在後台一鍵分享連結


## 架構

.

├── Api 需要跟資料庫互動的程式 

├── Backstage 後台編輯入口

├── Common 共用設定

├── Components 共用元件

├── Dependencies 引用資源

├── Images 圖片

├── ManageRoom 編輯後台資料

├── New 新增會客室入口

├── Room 檢視模式

├── index.css

├── index.js

├── index.php 訪客入口

├── package.json

├── pdoInc.php

└── yarn.lock


