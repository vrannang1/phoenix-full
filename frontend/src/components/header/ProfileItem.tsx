import { NavLink } from 'react-router-dom';
import { useGetUserQuery } from '@/queries/user.query';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
const ProfileItem = () => {
  const { data } = useGetUserQuery();

  return (
    <>
      <MenuItem
        component={NavLink}
        to={`profile/${data.username}`}
        state={data.username}>
        <Avatar alt={data.username} src={data.image} sx={{ width: 24, height: 24 }} />
      </MenuItem>
    </>
  );
};

export default ProfileItem;
