import { FC } from 'react'
import Menu, { MenuProps } from './menu'
import SubMenu, { SubMenuPros } from './subMenu'
import MenuIten, { MenuItemProps } from './menuItem'

export type IMenuComponent = FC<MenuProps> & {
  Item: FC<MenuItemProps>
  SubMenu: FC<SubMenuPros>
}

const TransMenu = Menu as IMenuComponent

TransMenu.Item = MenuIten
TransMenu.SubMenu = SubMenu

export default TransMenu
