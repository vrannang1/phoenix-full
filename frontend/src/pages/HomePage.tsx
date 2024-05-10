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
import Typography from '@mui/material/Typography';

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
      <Box sx={{ height: 150, color: '#fff', bgcolor: '#333', padding: '2rem', marginBottom: '2rem' }}>
        <Container maxWidth="lg">
          <Typography variant="h3">
            conduit
          </Typography>
          <Typography variant="body1">
            A place to share your knowledge
          </Typography>
        </Container>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={9}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                  <Tab label="Global Feed" />
                  {isLogin && (<Tab label="Your Feed" />)}
                </Tabs>
                <FeedList articlesInfo={articlesInfo.data} toUrl={'/'} page={page} setPage={setPage} />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                {tagsInfo.data.map((tag: string) => (
                  <Chip component={Link} to="/" key={tag} label={tag} onClick={() => { setSelectedTag(tag) }} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;