/**
 * electronUtils.ts
 *
 * Electron API와 커스텀 API에 쉽게 접근할 수 있는 유틸리티 파일입니다.
 * 모든 컴포넌트에서 일관된 방식으로 Electron 기능을 사용할 수 있도록 합니다.
 */

// 타입 정의 파일의 타입을 가져와 사용
import type { ElectronAPI } from '@electron-toolkit/preload'

// API 인터페이스 타입 정의
interface API {
  createNewWindow: () => void
  getWindowTitle: () => string
  setWindowTitle: (title: string) => void
  debugLog: (message: string, data?: unknown) => void
}

// Window 타입 확장 (TypeScript에게 전역 window 객체가 이런 속성을 가지고 있다고 알려줌)
declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

// 전역 window 객체에서 electron과 api 가져오기
export const electron = window.electron
export const api = window.api

// IPC 통신을 위한 헬퍼 함수
export const sendIpcMessage = (channel: string, ...args: unknown[]): void => {
  electron.ipcRenderer.send(channel, ...args)
}

// 디버그 로그 간편하게 사용
export const debugLog = (message: string, data?: unknown): void => {
  api.debugLog(message, data)
}
