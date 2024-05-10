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
import { CardActions } from '@mui/material';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface IFeedProps {
  article: IArticle;
}

const Feed = ({ article }: IFeedProps) => {
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

  // const styles = { display: "flex", alignItems: "center" };

  return (
    <div style={{ padding: 20 }} >
      <Card sx={{ maxWidth: 900 }}>
        <CardHeader
          avatar={
            <Avatar src={article.author.image} component={Link} to={`/profile/${article.author.username}`} state={article.author.username} alt={article.author.image} />
          }
          action={
            <Button
              onClick={() => onToggleFavorite()}
            >
              {article.favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              {article.favoritesCount}
            </Button>
          }
          title={<Typography sx={{ textTransform: 'capitalize', fontStyle: 'italic' }}>{article.author.username} </Typography>}
          subheader={convertToDate(article.createdAt)}
        />
        <CardContent>
          <Typography style={{ textDecoration: "none", boxShadow: "none" }} gutterBottom variant="h5" component={Link} to={`/article/${article.slug}`} state={article.slug}>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}>
            {article.body}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" component={Link} to={`/article/${article.slug}`} state={article.slug}>
            Read more...
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Feed;
