import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// 멀티 윈도우용 페이지 목록
const pages = [
  'quick_order',
  'total_chart',
  'request_deposit',
  'request_withdrawal',
  'banking_inquiry',
  'inquiry_order_signed_history',
  'client_log',
  'profit_loss_date',
  'recommended_info',
  'recommended_profit_loss',
  'recommended_total_profit_loss',
  'recommended_daily_profit_loss',
  'recommended_order_signed_history',
  'recommended_banking_history',
  'notice',
  'setting',
  'request_overnight',
  'change_password'
]

// 각 페이지의 입력 파일 설정
const input = {
  index: resolve(__dirname, 'src/renderer/index.html')
}

// 페이지별 입력 파일 추가
pages.forEach((page) => {
  input[page] = resolve(__dirname, `src/renderer/pages/${page}/index.html`)
})

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [svelte(), tailwindcss()],
    build: {
      rollupOptions: {
        input
      }
    }
  }
})
