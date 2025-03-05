import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 새 윈도우 생성 메서드 추가
  createNewWindow: (): void => {
    ipcRenderer.send('create-new-window')
  },
  getWindowTitle: (): string => {
    const titleElement = document.querySelector('title')
    const title = titleElement?.textContent || '제목 없음'

    // 메인 프로세스에 로그 전송
    ipcRenderer.send('log-to-main', {
      message: `getWindowTitle 호출됨: ${title}`,
      source: 'preload'
    })

    // 윈도우 타이틀 이벤트 발송
    ipcRenderer.send('window-title', title)

    return title
  },
  // 디버깅용 로그 함수 추가
  debugLog: (message: string, data?: unknown): void => {
    ipcRenderer.send('log-to-main', { message, data, source: 'renderer' }) // 메인 프로세스 터미널용
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
