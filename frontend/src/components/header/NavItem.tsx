import { IRouterMeta } from '@/lib/routerMeta';
import { NavLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

interface INavItemProps {
  menu: IRouterMeta;
}

const NavItem = ({ menu }: INavItemProps) => {
  return (
    <MenuItem
      sx={{ py: '6px', px: '12px' }}
      component={NavLink} to={menu.path}
    >
      <Typography variant="body2" color="text.primary" >
        {menu.name}
      </Typography>
    </MenuItem>

  );
};

export default NavItem;
