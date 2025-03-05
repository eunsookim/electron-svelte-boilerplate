import { Menu, MenuItemConstructorOptions, app } from 'electron'
import createModal from './createModal.js'
import { menuItems, MenuItemType } from './menuItems'

/**
 * MenuItemType을 MenuItemConstructorOptions로 변환하는 함수
 * route 프로퍼티가 있는 항목에는 click 핸들러를 추가합니다.
 */
function convertToMenuTemplate(items: MenuItemType[]): MenuItemConstructorOptions[] {
  return items.map((item) => {
    const menuItem: MenuItemConstructorOptions = {
      label: item.label,
      type: item.type as 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio',
      role: item.role as
        | 'reload'
        | 'forceReload'
        | 'toggleDevTools'
        | 'resetZoom'
        | 'zoomIn'
        | 'zoomOut'
        | 'togglefullscreen'
        | undefined
    }

    // submenu가 있으면 재귀적으로 변환
    if (item.submenu && item.submenu.length > 0) {
      menuItem.submenu = convertToMenuTemplate(item.submenu)
    }
    // route가 있으면 click 핸들러 추가
    else if (item.route) {
      menuItem.click = (): void => {
        createModal(item.route!, item.width, item.height)
      }
    }
    // label만 있고 route가 없는 항목 (추가 설정 필요)
    else if (item.label && !item.type && !item.role) {
      menuItem.click = (): void => console.log(`${item.label} 클릭됨`)
    }

    return menuItem
  })
}

// 메뉴 템플릿 생성
const menuTemplate: MenuItemConstructorOptions[] = convertToMenuTemplate(menuItems)

// macOS에서 앱 메뉴 추가 (필요한 경우)
if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })
}

// 메뉴 생성 및 설정 함수
export function setupMenu(): void {
  try {
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
    console.log('애플리케이션 메뉴가 성공적으로 설정되었습니다.')
  } catch (error) {
    console.error('메뉴 설정 중 오류 발생:', error)
  }
}
