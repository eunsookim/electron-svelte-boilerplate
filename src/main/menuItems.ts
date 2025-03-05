/**
 * menuItems.ts
 *
 * 이 파일은 애플리케이션의 메뉴 구조를 정의합니다.
 * menu.ts 파일에서 분리된 메뉴 아이템 구조만 담고 있으며,
 * 실제 동작 로직(click 이벤트 핸들러 등)은 포함하지 않습니다.
 *
 * 사용 방법:
 * - import { menuItems } from './menuItems' 또는
 * - import { getMenuTemplate } from './menuItems'를 사용하여 메뉴 구조를 가져올 수 있습니다.
 * - 특정 메뉴 라벨의 라우트 정보는 getRouteInfo(label) 함수로 조회할 수 있습니다.
 * - 특정 메뉴 아이템은 findMenuItem(label) 함수로 찾을 수 있습니다.
 */

import { MenuItemConstructorOptions } from 'electron'

// 메뉴 아이템을 위한 인터페이스 정의
export interface MenuItemType {
  label?: string // separator 타입의 경우 label이 필요없으므로 선택적으로 변경
  submenu?: MenuItemType[]
  type?: string
  route?: string
  width?: number
  height?: number
  role?: string
}

// 메뉴 경로 정보만 담고 있는 객체
export interface RouteConfig {
  route: string
  width?: number
  height?: number
}

// 메뉴 라벨에 대응하는 라우트 정보 맵핑
const routeMapping: Record<string, RouteConfig> = {}

// label과 submenu만 있는 메뉴 구조 정의
export const menuItems: MenuItemType[] = [
  {
    label: '',
    submenu: [
      { label: '새로고침', role: 'reload' },
      { label: '강제 새로고침', role: 'forceReload' },
      { label: '개발자 도구', role: 'toggleDevTools' },
      { type: 'separator', label: '구분선' },
      { label: '줌 초기화', role: 'resetZoom' },
      { label: '확대', role: 'zoomIn' },
      { label: '축소', role: 'zoomOut' },
      { type: 'separator', label: '구분선' },
      { label: '전체화면', role: 'togglefullscreen' }
    ]
  }
]

// 메뉴 아이템을 Electron 메뉴 형식으로 변환하는 함수
export function getMenuTemplate(): MenuItemConstructorOptions[] {
  // 여기서는 실제 동작 로직을 넣지 않고, 구조만 반환합니다.
  // 실제 사용 시에는 click 핸들러를 추가해야 합니다.
  return menuItems as MenuItemConstructorOptions[]
}

// 메뉴 아이템에서 라우트 정보 가져오기
export function getRouteInfo(label: string): RouteConfig | undefined {
  return routeMapping[label]
}

// 특정 라벨의 메뉴 아이템 찾기
export function findMenuItem(label: string): MenuItemType | undefined {
  for (const menu of menuItems) {
    if (menu.label === label) {
      return menu
    }

    if (menu.submenu) {
      for (const submenu of menu.submenu) {
        if (submenu.label === label) {
          return submenu
        }
      }
    }
  }

  return undefined
}

export default menuItems
