import { useGetArticleQueries } from '@/queries/articles.query';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ButtonSelector from '@/components/article/ButtonSelector';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';
import Comment from '@/components/article/Comment';
import routerMeta from '@/lib/routerMeta';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

const ArticlePage = () => {
  const { state } = useLocation();
  const [articleInfo, commentsInfo] = useGetArticleQueries(state);
  const { isLogin } = useContext(UserContext);

  return (
    <>
      <Box sx={{ height: 150, color: '#fff', bgcolor: '#333', padding: '2rem', marginBottom: '2rem' }}>
        <Container maxWidth="lg">
          <Typography variant="h5">{articleInfo.data.title}</Typography>
          {/* <Typography variant="body1">
            {articleInfo.data.description}
          </Typography> */}
          {/* {console.log(articleInfo.data)} */}
          {articleInfo.data.tagList.map((tag: any) => {
            return <Chip color="primary" key={tag} label={tag} />;
          })}
        </Container>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={9}>
              <Grid container alignItems="center" spacing={0.5}>
                <Grid item>
                  <Avatar alt="Avatar" src={articleInfo.data.author.image} sx={{ width: 24, height: 24 }} />
                </Grid>
                <Grid item>
                  <Typography
                    component={Link}
                    to={`/profile/${articleInfo.data.author.username}`}
                    state={articleInfo.data.author.username}
                    variant="subtitle1"
                    sx={{ textDecoration: 'none', textTransform: 'capitalize' }}
                  >
                    {articleInfo.data.author.username}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3} container justifyContent="flex-end">
              {isLogin ? <ButtonSelector articleInfo={articleInfo.data} /> : <></>}
            </Grid>
          </Grid>
          <ReactMarkdown children={articleInfo.data.body} remarkPlugins={[remarkGfm]}></ReactMarkdown>
          {articleInfo.data.tagList.map((tag: string) => (
            <Chip key={tag} label={tag} />
          ))}
        </Container>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          {isLogin ? (
            <Comment comments={commentsInfo.data} slug={articleInfo.data.slug} />
          ) : (
            <p>
              <Link to={routerMeta.SignInPage.path}>Sign in</Link>
              &nbsp;or&nbsp;
              <Link to={routerMeta.SignUpPage.path}>Sign up</Link>
              &nbsp;to add comments on this article.
            </p>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ArticlePage;
