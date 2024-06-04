import { UserContext } from '@/contexts/UserContextProvider';
import { useContext } from 'react';
import FollowButton from './profile/FollowButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Card, CardHeader, CardMedia, Paper } from '@mui/material';
import { CardContent, CardActions, Button, IconButton, Link as MuiLink, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
      <Container component="main" maxWidth="lg">
        <Card sx={{ width: '100%', margin: 'auto', position: 'relative', textAlign: 'center' }}>
          <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
            {isLogin ? <FollowButton profileName={profile.username} isFollow={profile.following} /> : <></>}
            <IconButton aria-label="settings" sx={{ marginTop: 1 }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <CardContent>
            <Avatar
              aria-label="profile-picture"
              src={profile.image}
              sx={{ width: 80, height: 80, margin: 'auto', marginBottom: 1 }}
            />
            <Typography variant="h4" component="div">
              {profile.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ marginTop: 2 }}>
              {profile.bio ? profile.bio : 'No bio found'}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ marginRight: 0.5 }} /> San Francisco, CA
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Joined on January 1, 2021
              </Typography>
              <MuiLink href="https://example.com" variant="body2" color="primary" target="_blank" rel="noopener">
                https://example.com
              </MuiLink>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: "20px" }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Education:</strong> Bachelor&apos;s in Computer Science
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Work:</strong> Software Engineer at ABC Corp
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Programming Languages:</strong> JavaScript, Python, C++
              </Typography>
            </Box>
          </CardActions>
        </Card>
      </Container>
    </>
  );
};

export default Profile;
