import { QUERY_PROFILE_KEY } from '@/constants/query.constant';
import queryClient from '@/queries/queryClient';
import routerMeta from '@/lib/routerMeta';
import { useFollowUserMutation, useUnFollowUserMutation } from '@/queries/profiles.query';
import { useGetUserQuery } from '@/queries/user.query';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface IFollowButton {
  profileName: string;
  isFollow: boolean;
}
const FollowButton = ({ profileName, isFollow }: IFollowButton) => {
  const { data } = useGetUserQuery();
  const followUserMutation = useFollowUserMutation();
  const unfollowUserMutation = useUnFollowUserMutation();

  const onToggleFollow = () => {
    const username = profileName;
    if (isFollow) {
      unfollowUserMutation.mutate(
        { username },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_PROFILE_KEY] });
          },
        },
      );
      return;
    }

    if (!isFollow) {
      followUserMutation.mutate(
        { username },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_PROFILE_KEY] });
          },
        },
      );
      return;
    }
  };

  return (
    <>
      {data.username === profileName ? (
        <Typography component={Link} to={routerMeta.SettingPage.path} variant="h5" color="white" sx={{ textDecoration: 'none' }}>
          <SettingsIcon /> Edit Settings
        </Typography>
      ) : (
        <Typography component={Button} onClick={() => onToggleFollow()} variant="h5" color="white" sx={{ textDecoration: 'none', textTransform: "capitalize" }}>
          {isFollow ? <AddCircleIcon /> : <AddCircleOutlineIcon />} Follow {profileName}</Typography>
      )}
    </>
  );
};

export default FollowButton;

{/* <Link to={routerMeta.SettingPage.path} className="btn btn-sm btn-outline-secondary action-btn">
          <i className="ion-gear-a"></i>&nbsp; Edit Profile Settings
        </Link> 
      

         <button
          type="button"
          className={`btn btn-sm btn-outline-${isFollow ? 'primary' : 'secondary'} action-btn`}
          onClick={() => onToggleFollow()}
        >
          <i className="ion-plus-round"></i>
          &nbsp; Follow {profileName}
        </button>
      
      
      */}
