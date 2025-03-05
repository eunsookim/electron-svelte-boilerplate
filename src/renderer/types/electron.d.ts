import { ElectronAPI } from '@electron-toolkit/preload'

// API 인터페이스 정의 (src/preload/index.d.ts와 동일)
interface API {
  createNewWindow: () => void
  getWindowTitle: () => string
  setWindowTitle: (title: string) => void
  debugLog: (message: string, data?: unknown) => void
}

// 전역 Window 타입 확장
declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
