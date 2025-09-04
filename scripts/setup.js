#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 開始設定待辦清單 App...\n')

// 檢查 Node.js 版本
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

if (majorVersion < 16) {
  console.error('❌ 需要 Node.js 16 或更新版本')
  console.error(`   目前版本: ${nodeVersion}`)
  process.exit(1)
}

console.log('✅ Node.js 版本檢查通過')

// 檢查是否已安裝依賴
if (!fs.existsSync('node_modules')) {
  console.log('📦 安裝依賴套件...')
  try {
    execSync('npm install', { stdio: 'inherit' })
    console.log('✅ 依賴套件安裝完成')
  } catch (error) {
    console.error('❌ 依賴套件安裝失敗')
    process.exit(1)
  }
} else {
  console.log('✅ 依賴套件已安裝')
}

// 檢查環境變數檔案
if (!fs.existsSync('.env.local')) {
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env.local')
    console.log('📝 已建立 .env.local 檔案')
    console.log('⚠️  請編輯 .env.local 檔案，填入你的 Supabase 設定')
  } else {
    console.log('⚠️  找不到 .env.example 檔案')
  }
} else {
  console.log('✅ 環境變數檔案已存在')
}

// 顯示 Supabase 設定提示
console.log('\n📋 Supabase 資料庫設定：')
console.log('─'.repeat(50))
console.log('1. 前往 https://supabase.com 建立專案')
console.log('2. 在 SQL Editor 中執行資料表建立指令')
console.log('3. 複製 Project URL 和 anon key 到 .env.local')
console.log('')
console.log('📖 詳細的 SQL 操作步驟請參考：')
console.log('   docs/SUPABASE_SQL_SETUP.md')
console.log('─'.repeat(50))

console.log('\n📚 接下來的步驟：')
console.log('1. 在 Supabase 建立專案並執行上述 SQL 指令')
console.log('2. 編輯 .env.local 檔案，填入 Supabase URL 和 API Key')
console.log('3. 執行 npm run dev 啟動開發伺服器')
console.log('4. 開啟 http://localhost:3000 查看應用程式')

console.log('\n📖 詳細說明請參考：')
console.log('- docs/SETUP_GUIDE.md - 完整設定指南')
console.log('- docs/SECURITY_BEST_PRACTICES.md - 安全性最佳實踐')
console.log('- docs/EXTENSION_GUIDE.md - 功能擴展指南')

console.log('\n🎉 設定完成！祝你開發愉快！')