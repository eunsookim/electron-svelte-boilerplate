import { ElectronAPI } from '@electron-toolkit/preload'

// API 인터페이스 정의
interface API {
  createNewWindow: () => void
  getWindowTitle: () => string
  setWindowTitle: (title: string) => void
  debugLog: (message: string, data?: unknown) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
