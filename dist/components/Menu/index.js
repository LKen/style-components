import Menu from './menu';
import SubMenu from './subMenu';
import MenuIten from './menuItem';
var TransMenu = Menu;
TransMenu.Item = MenuIten;
TransMenu.SubMenu = SubMenu;
export default TransMenu;
