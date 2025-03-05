import { app, shell, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { setupMenu } from './menu' // 메뉴 설정 함수 임포트

// 윈도우를 관리하기 위한 Map 객체
const windows = new Map<number, BrowserWindow>()

// 윈도우 생성 함수 (ID를 파라미터로 받음)
function createWindow(id?: number): BrowserWindow {
  // 새 ID 생성 (없는 경우)
  const windowId = id || Date.now()

  // 브라우저 윈도우 생성
  const newWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 윈도우 ID 저장
  newWindow.setTitle('Window ' + windowId)

  // Map에 윈도우 추가
  windows.set(windowId, newWindow)

  newWindow.on('ready-to-show', () => {
    newWindow.show()
  })

  newWindow.on('closed', () => {
    // Map에서 윈도우 제거
    windows.delete(windowId)
  })

  newWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    newWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    newWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  return newWindow
}

// 새 윈도우 생성 함수
function openNewWindow(): void {
  createWindow()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 앱 메뉴 설정
  setupMenu()

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 새 윈도우 생성 IPC 핸들러 추가
  ipcMain.on('create-new-window', () => {
    openNewWindow()
    console.log('create-new-window')
  })

  // 디버깅 로그 핸들러 추가
  ipcMain.on('log-to-main', (_, data) => {
    try {
      const timestamp = new Date().toISOString()
      // 메시지 형식에 따라 적절히 로깅
      if (typeof data === 'object' && data !== null) {
        const { message, source, data: logData } = data
        console.log(
          `[${timestamp}] [${source || 'unknown'}] ${message}`,
          logData !== undefined ? logData : ''
        )
      } else {
        console.log(`[${timestamp}] ${data}`)
      }
    } catch (error) {
      console.error('로그 처리 중 오류 발생:', error)
    }
  })

  // 타이틀바 컨트롤 이벤트 핸들러 추가
  ipcMain.on('window-minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) window.minimize()
  })

  ipcMain.on('window-maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
    }
  })

  ipcMain.on('window-close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) window.close()
  })

  ipcMain.on('get-window-title', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      event.sender.send('window-title', window.getTitle())
    }
  })

  // 첫 번째 윈도우 생성
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
