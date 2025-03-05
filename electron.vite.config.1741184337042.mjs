// electron.vite.config.ts
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
var __electron_vite_injected_dirname =
  'C:\\Users\\kimes\\electron-boilerplate\\electron-svelte-boilerplate'
var pages = [
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
var input = {
  index: resolve(__electron_vite_injected_dirname, 'src/renderer/index.html')
}
pages.forEach((page) => {
  input[page] = resolve(__electron_vite_injected_dirname, `src/renderer/pages/${page}/index.html`)
})
var electron_vite_config_default = defineConfig({
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
export { electron_vite_config_default as default }
