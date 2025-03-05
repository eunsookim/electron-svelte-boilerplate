/// <reference types="svelte" />
/// <reference types="vite/client" />
import { ElectronAPI } from '@electron-toolkit/preload'

// API 인터페이스 정의
interface API {
  createNewWindow: () => void
  getWindowTitle: () => string
  setWindowTitle: (title: string) => void
  debugLog: (message: string, data?: unknown) => void
}

// Window 타입 확장
declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

// 더 쉬운 사용을 위해 전역 객체로 export
export const electron = window.electron
export const api = window.api
