import { useGetProfileQueries } from '@/queries/profiles.query';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Profile from '@/components/Profile';
import FeedList from '@/components/feed/FeedList';
import { Container, Tabs, Tab, Grid, Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';

const ProfilePage = () => {
  const { isLogin } = useContext(UserContext);
  const { state } = useLocation();
  const [page, setPage] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [profileInfo, articlesInfo] = useGetProfileQueries(state, page, isFavorited);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setIsFavorited(newValue === 1);
  };

  return (
    <div>
      <Profile profile={profileInfo.data} />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} marginTop={2}>
            <Card>
              <CardContent>
                <Typography variant="h5">Programming Languages</Typography>
                <Divider sx={{ marginY: 1 }} />
                <Typography variant="body2">JavaScript, Python, C++</Typography>
              </CardContent>
            </Card>
            <Card sx={{ marginTop: 2 }}>
              <CardContent>
                <Typography variant="h5">Currently Learning</Typography>
                <Divider sx={{ marginY: 1 }} />
                <Typography variant="body2">TypeScript, Go</Typography>
              </CardContent>
            </Card>
            <Card sx={{ marginTop: 2 }}>
              <CardContent>
                <Typography variant="h5">User Statistics</Typography>
                <Divider sx={{ marginY: 1 }} />
                <Typography variant="body2">Number of posts: 50</Typography>
                <Typography variant="body2">Number of comments: 150</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Tabs
              value={location.pathname === `/profile/${state}/favorites` ? 1 : 0}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                label="My Articles"
                component={NavLink}
                to={`/profile/${state}`}
                onClick={() => setIsFavorited(false)}
              />
              {isLogin && (
                <Tab
                  label="Favorited Articles"
                  component={NavLink}
                  to={`/profile/${state}/favorites`}
                  onClick={() => setIsFavorited(true)}
                />
              )}
            </Tabs>
            <Routes>
              <Route
                path="/"
                element={
                  <FeedList
                    articlesInfo={articlesInfo.data}
                    toUrl={`/profile/${state}`}
                    page={page}
                    setPage={setPage}
                  />
                }
              />
              <Route
                path="/favorites"
                element={
                  <FeedList
                    articlesInfo={articlesInfo.data}
                    toUrl={`/profile/${state}`}
                    page={page}
                    setPage={setPage}
                  />
                }
              />
            </Routes>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ProfilePage;
