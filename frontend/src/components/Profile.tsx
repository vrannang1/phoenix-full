import { UserContext } from '@/contexts/UserContextProvider';
import { useContext } from 'react';
import FollowButton from './profile/FollowButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

interface IProfileProps {
  profile: {
    image: string;
    username: string;
    bio: string;
    following: boolean;
  };
}

const Profile = ({ profile }: IProfileProps) => {
  const { isLogin } = useContext(UserContext);
  return (
    <Box sx={{ height: 150, color: '#fff', bgcolor: '#333', padding: '2rem', marginBottom: '2rem' }}>
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={9}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar alt="Avatar" src={profile.image} sx={{ width: 100, height: 100 }}/>
              </Grid>
              <Grid item>
                <Typography variant="h3" sx={{ textTransform: 'capitalize' }}>{profile.username}</Typography>
                <Typography variant="body1">
                  {profile.bio}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3} container justifyContent="flex-end">
            {isLogin ? <FollowButton profileName={profile.username} isFollow={profile.following} /> : <></>}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;