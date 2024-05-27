import { useGetProfileQueries } from '@/queries/profiles.query';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Profile from '@/components/Profile';
import FeedList from '@/components/feed/FeedList';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';

const ProfilePage = () => {
  const { isLogin } = useContext(UserContext);
  const { state } = useLocation();
  const [page, setPage] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [profileInfo, articlesInfo] = useGetProfileQueries(state, page, isFavorited);

  return (
    <div>
      <Profile profile={profileInfo.data} />
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <div>
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end
                to={`/profile/${state}`}
                onClick={() => setIsFavorited(false)}
                state={state}
              >
                My Articles
              </NavLink>
            </div>
          </Grid>
          {isLogin ?
          <Grid item>
            <div style={{ marginLeft: '20px' }}> {/* Adjust the margin as needed */}
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end
                to={`/profile/${state}/favorites`}
                onClick={() => setIsFavorited(true)}
                state={state}
              >
                Favorited Articles
              </NavLink>
            </div>
          </Grid> : <></>}
        </Grid>
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
      </Container>
      </div>
  );
};

export default ProfilePage;
