import { FC } from 'react';
import { MenuProps } from './menu';
import { SubMenuPros } from './subMenu';
import { MenuItemProps } from './menuItem';
export declare type IMenuComponent = FC<MenuProps> & {
    Item: FC<MenuItemProps>;
    SubMenu: FC<SubMenuPros>;
};
declare const TransMenu: IMenuComponent;
export default TransMenu;
