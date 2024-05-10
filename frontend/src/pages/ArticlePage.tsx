import { useGetArticleQueries } from '@/queries/articles.query';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ButtonSelector from '@/components/article/ButtonSelector';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';
import Comment from '@/components/article/Comment';
import routerMeta from '@/lib/routerMeta';
import convertToDate from '@/lib/utils/convertToDate';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const ArticlePage = () => {
  const { state } = useLocation();
  const [articleInfo, commentsInfo] = useGetArticleQueries(state);
  const { isLogin } = useContext(UserContext);

  return (
    <>

      <Box sx={{ height: 150, color: '#fff', bgcolor: '#333', padding: '2rem', marginBottom: '2rem' }}>
        <Container maxWidth="lg">
          <Typography variant="h3">
            {articleInfo.data.title}
          </Typography>
          <Typography variant="body1">
            {articleInfo.data.description}
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={9}>
              <Grid container alignItems="center" spacing={0.5}>
                <Grid item>
                  <Avatar alt="Avatar" src={articleInfo.data.author.image} sx={{ width: 24, height: 24 }} />
                </Grid>
                <Grid item>
                  <Typography component={Link}
                    to={`/profile/${articleInfo.data.author.username}`} state={articleInfo.data.author.username}
                    variant="subtitle1" color="white" sx={{ textDecoration: 'none', textTransform: "capitalize" }}>{articleInfo.data.author.username}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3} container justifyContent="flex-end">
              {isLogin ? <ButtonSelector articleInfo={articleInfo.data} /> : <></>}
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <ReactMarkdown children={articleInfo.data.body} remarkPlugins={[remarkGfm]}></ReactMarkdown>
        </Container>
      </Box>
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <div className="article-meta">
              <Link to={`/profile/${articleInfo.data.author.username}`} state={articleInfo.data.author.username}>
                <img src={articleInfo.data.author.image} alt="comment-author" />
              </Link>

              <div className="info">
                <Link
                  to={`/profile/${articleInfo.data.author.username}`}
                  state={articleInfo.data.author.username}
                  className="author"
                >
                  {articleInfo.data.author.username}
                </Link>
                <span className="date">{convertToDate(articleInfo.data.updatedAt)}</span>
              </div>
              {isLogin ? <ButtonSelector articleInfo={articleInfo.data} /> : <></>}
            </div>
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <ReactMarkdown children={articleInfo.data.body} remarkPlugins={[remarkGfm]}></ReactMarkdown>
            </div>
          </div>
          <div>
            {articleInfo.data.tagList.map((tag: string) => (
              <li key={tag} className="tag-default tag-pill tag-outline">
                {tag}
              </li>
            ))}
          </div>
          <hr />

          <div className="article-actions">
            <div className="article-meta">
              <Link to={`/profile/${articleInfo.data.author.username}`} state={articleInfo.data.author.username}>
                <img src={articleInfo.data.author.image} alt="profile" />
              </Link>
              <div className="info">
                <Link
                  to={`/profile/${articleInfo.data.author.username}`}
                  state={articleInfo.data.author.username}
                  className="author"
                >
                  {articleInfo.data.author.username}
                </Link>
                <span className="date">{convertToDate(articleInfo.data.updatedAt)}</span>
              </div>
              {isLogin ? <ButtonSelector articleInfo={articleInfo.data} /> : <></>}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
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
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default ArticlePage;
