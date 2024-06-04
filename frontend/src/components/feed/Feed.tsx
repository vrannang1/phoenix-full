import { useFavoriteArticleMutation, useUnfavoriteArticleMutation } from '@/queries/articles.query';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';
import routerMeta from '@/lib/routerMeta';
import queryClient from '@/queries/queryClient';
import { QUERY_ARTICLES_KEY } from '@/constants/query.constant';
import convertToDate from '@/lib/utils/convertToDate';
import { IArticle } from '@/interfaces/main';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { CardActions, CardMedia, Chip } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface IFeedProps {
  article: IArticle;
  coverImage: boolean;
}

const Feed = ({ article, coverImage }: IFeedProps) => {
  const { isLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const favoriteArticleMutation = useFavoriteArticleMutation();
  const unfavoriteArticleMutation = useUnfavoriteArticleMutation();

  const onToggleFavorite = () => {
    const { slug } = article;

    if (!isLogin) {
      navigate(routerMeta.SignInPage.path);
      return;
    }

    if (article.favorited) {
      unfavoriteArticleMutation.mutate(
        { slug },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_ARTICLES_KEY] });
          },
        },
      );
    }

    if (!article.favorited) {
      favoriteArticleMutation.mutate(
        { slug },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_ARTICLES_KEY] });
          },
        },
      );
      return;
    }
  };

  return (
    <div style={{ padding: 5 }}>
      <Card
        sx={{
          maxWidth: 900,
          ':hover': {
            boxShadow: 5, // theme.shadows[20]
          },
        }}
      >
        {coverImage && (
          <CardMedia
            sx={{ height: 240 }}
            image={article.coverImage ? article.coverImage : article.imageUrl}
            title="green iguana"
          />
        )}
        <CardHeader
          avatar={
            <Avatar
              src={article.author.image}
              component={Link}
              to={`/profile/${article.author.username}`}
              state={article.author.username}
              alt={article.author.image}
              sx={{ marginRight: -1.4 }}
            />
          }
          action={
            <Tooltip title={article.favorited ? 'Unfavorite' : 'Favorite'}>
              <Button onClick={() => onToggleFavorite()}>
                {article.favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                {article.favoritesCount}
              </Button>
            </Tooltip>
          }
          title={
            <Typography
              sx={{ textTransform: 'capitalize', textDecoration: 'none', fontWeight: 'bold' }}
              component={Link}
              to={`/profile/${article.author.username}`}
              state={article.author.username}
            >
              {article.author.fullName}{' '}
            </Typography>
          }
          subheader={
            <Typography
              sx={{ textDecoration: 'none', fontSize: '13px' }}
            >
              {convertToDate(article.createdAt)}
            </Typography>
          }
        />
        <CardContent>
          <Typography
            style={{ textDecoration: 'none', boxShadow: 'none' }}
            gutterBottom
            variant="h5"
            component={Link}
            to={`/article/${article.slug}`}
            state={article.slug}
          >
            {article.title}
          </Typography>
          <p>
            {article.tagList.map((tag) => {
              return <Chip key={tag} label={tag} />;
            })}
          </p>

          {/* <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {article.body}
          </Typography> */}
        </CardContent>
        <CardActions>
          {/* <Button size="small" color="primary" component={Link} to={`/article/${article.slug}`} state={article.slug}>
            Read more...
          </Button> */}
        </CardActions>
      </Card>
    </div>
  );
};

export default Feed;
