import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

/**
 * 모달 창을 생성하는 함수
 * @param route 모달에서 로드할 경로
 * @param width 창 너비 (기본값: 800)
 * @param height 창 높이 (기본값: 600)
 * @returns 생성된 BrowserWindow 객체
 */
export default function createModal(route: string, width = 800, height = 600): BrowserWindow {
  try {
    // 슬래시 제거하여 경로명만 추출
    const pageName = route.startsWith('/') ? route.substring(1) : route

    // 브라우저 윈도우 생성
    const modal = new BrowserWindow({
      width,
      height,
      parent: BrowserWindow.getFocusedWindow() || undefined,
      modal: true,
      show: false,
      autoHideMenuBar: true,
      frame: false,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    modal.on('ready-to-show', () => {
      modal.show()
    })

    // 개발 모드에서는 Vite 개발 서버에서 페이지 로드, 프로덕션에서는 빌드된 파일 로드
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      // 페이지 이름이 존재하는 경우 해당 페이지로 이동, 아니면 메인 페이지
      if (pageName) {
        modal.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/${pageName}.html`)
      } else {
        modal.loadURL(process.env['ELECTRON_RENDERER_URL'])
      }
    } else {
      // 프로덕션에서는 빌드된 HTML 파일 로드
      if (pageName) {
        modal.loadFile(join(__dirname, `../renderer/${pageName}.html`))
      } else {
        modal.loadFile(join(__dirname, '../renderer/index.html'))
      }
    }

    return modal
  } catch (error) {
    console.error('모달 창 생성 중 오류 발생:', error)
    throw error
  }
}
