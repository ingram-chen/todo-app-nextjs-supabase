#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 檢查專案設定狀態...\n')

let allGood = true

// 檢查必要檔案
const requiredFiles = [
  'package.json',
  '.env.local',
  'components/TaskForm.js',
  'components/TaskItem.js',
  'components/TaskList.js',
  'lib/supabase.js',
  'pages/index.js',
  'pages/_app.js',
  'styles/globals.css'
]

console.log('📁 檢查必要檔案:')
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - 檔案不存在`)
    allGood = false
  }
})

// 檢查 node_modules
console.log('\n📦 檢查依賴套件:')
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules - 依賴套件已安裝')
} else {
  console.log('❌ node_modules - 請執行 npm install')
  allGood = false
}

// 檢查環境變數
console.log('\n🔑 檢查環境變數:')
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && 
      !envContent.includes('your_supabase_project_url')) {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL - 已設定')
  } else {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL - 未正確設定')
    allGood = false
  }
  
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && 
      !envContent.includes('your_supabase_anon_key')) {
    console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY - 已設定')
  } else {
    console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY - 未正確設定')
    allGood = false
  }
} else {
  console.log('❌ .env.local - 檔案不存在')
  allGood = false
}

// 檢查 package.json 中的依賴
console.log('\n📋 檢查關鍵依賴:')
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    '@supabase/supabase-js',
    'tailwindcss'
  ]
  
  requiredDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`✅ ${dep} - v${deps[dep]}`)
    } else {
      console.log(`❌ ${dep} - 未安裝`)
      allGood = false
    }
  })
}

// 總結
console.log('\n' + '='.repeat(50))
if (allGood) {
  console.log('🎉 所有檢查都通過！')
  console.log('\n📋 接下來的步驟:')
  console.log('1. 確認 Supabase 資料表已建立（參考 docs/SUPABASE_SQL_SETUP.md）')
  console.log('2. 執行 npm run dev 啟動開發伺服器')
  console.log('3. 開啟 http://localhost:3000 測試應用程式')
} else {
  console.log('⚠️  發現一些問題需要修正')
  console.log('\n🔧 建議的修正步驟:')
  console.log('1. 執行 npm install 安裝依賴')
  console.log('2. 複製 .env.example 到 .env.local')
  console.log('3. 在 .env.local 中填入正確的 Supabase 設定')
  console.log('4. 重新執行 npm run check-setup')
}

console.log('\n📖 需要幫助？查看文件:')
console.log('- docs/SUPABASE_SQL_SETUP.md - SQL 操作詳細指南')
console.log('- docs/VISUAL_SETUP_GUIDE.md - 視覺化設定指南')
console.log('- docs/SETUP_GUIDE.md - 完整設定教學')