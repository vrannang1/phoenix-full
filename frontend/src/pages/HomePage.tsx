import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import FeedList from '@/components/feed/FeedList';
import { useGetArticlesQueries } from '@/queries/articles.query';
import { UserContext } from '@/contexts/UserContextProvider';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DraftsIcon from '@mui/icons-material/Drafts';
import HomeIcon from '@mui/icons-material/Home';
import TagIcon from '@mui/icons-material/Tag';
import { Button } from '@mui/material';

const HomePage = () => {
  const { isLogin } = useContext(UserContext);
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const [isGlobal, setIsGlobal] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');
  const [articlesInfo, tagsInfo] = useGetArticlesQueries(isGlobal, page, selectedTag);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    value === 0 ? setIsGlobal(false) : setIsGlobal(true);
    setValue(newValue);
  };

  return (
    <>
      {/* <Box sx={{ height: 150, color: '#fff', bgcolor: '#333', padding: '2rem', marginBottom: '2rem' }}>
        <Container maxWidth="lg">
          <Typography variant="h3">conduit</Typography>
          <Typography variant="body1">A place to share your knowledge</Typography>
        </Container>
      </Box> */}
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: '20px' }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} lg={2} >
              <Box sx={{ borderBottom: 1, borderColor: 'divider', display: { xs: 'none', sm: 'block' } }} >
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
                  <ListItemButton>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <TagIcon />
                    </ListItemIcon>
                    <ListItemText primary="Tags" />
                  </ListItemButton>
                </List>
              </Box>
            </Grid>
            <Grid item xs={12} lg={7}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                  <Tab label="Global Feed" />
                  {isLogin && <Tab label="Your Feed" />}
                </Tabs>
                <FeedList articlesInfo={articlesInfo.data} toUrl={'/'} page={page} setPage={setPage} />
              </Box>
            </Grid>
            <Grid item xs={12} lg={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Box>
                <Typography variant="h6" margin={3}>
                  Popular Tags
                </Typography>
                <Grid container spacing={2} margin={2}>
                  {tagsInfo.data.map((tag: string) => (
                    <Grid key={tag} item xs={8}>
                      <Link
                        to="/"
                        key={tag}
                        style={{ textDecoration: 'none', fontWeight: "bold" }}
                        onClick={() => {
                          setSelectedTag(tag);
                        }}
                      >
                        #{tag}
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
