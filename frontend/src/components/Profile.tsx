import { UserContext } from '@/contexts/UserContextProvider';
import { useContext } from 'react';
import FollowButton from './profile/FollowButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Card, CardHeader, CardMedia, Paper } from '@mui/material';
// import Tooltip from '@mui/material/Tooltip';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

interface IProfileProps {
  profile: {
    image: string;
    fullName: string;
    username: string;
    bio: string;
    following: boolean;
  };
}

const Profile = ({ profile }: IProfileProps) => {

  const { isLogin } = useContext(UserContext);
  
  return (
    <>
      <Container component="main" maxWidth="sm">
        <Box
        >
          <Grid sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Avatar alt="Avatar" src={profile.image} sx={{ width: 48, height: 48 }} />
            <Typography variant="h5" marginTop={2}>{profile.fullName}</Typography>
            {isLogin ? <FollowButton profileName={profile.username} isFollow={profile.following} /> : <></>}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Profile;
