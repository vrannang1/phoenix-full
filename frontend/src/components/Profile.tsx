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
    username: string;
    bio: string;
    following: boolean;
  };
}

const Profile = ({ profile }: IProfileProps) => {
  const { isLogin } = useContext(UserContext);
  return (
    <>
      <Box margin={10}>
        <Container maxWidth="lg">
          <Card sx={{ maxWidth: 900, alignContent: "center", justifyContent: "center"}} >
            <CardHeader avatar={
            <Avatar src={profile.image} />
          }>

          </CardHeader>
          </Card>
        </Container>
      </Box>
      <Box sx={{ padding: '2rem', marginBottom: '2rem' }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={9}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar alt="Avatar" src={profile.image} sx={{ width: 48, height: 48 }} />
                </Grid>
                <Grid item>
                  <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                    {profile.username}
                  </Typography>
                </Grid>
              </Grid>
              <Typography
                variant="body1"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {profile.bio}
              </Typography>
            </Grid>
            <Grid item xs={3} container justifyContent="flex-end">
              {isLogin ? <FollowButton profileName={profile.username} isFollow={profile.following} /> : <></>}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Profile;
