import useInputs from '@/lib/hooks/useInputs';
import queryClient from '@/queries/queryClient';
import { useUpdateArticleMutation } from '@/queries/articles.query';
import { QUERY_ARTICLE_KEY } from '@/constants/query.constant';
import { useLocation, useNavigate } from 'react-router-dom';

import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const EditArticlePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [articleData, onChangeArticleData, setArticleData] = useInputs({
    slug: state.slug,
    title: state.title,
    description: state.description,
    body: state.body,
    tag: '',
    tagList: state.tagList,
  });

  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!articleData.tagList.includes(articleData.tag)) {
        addTag(articleData.tag);
      }
    }
  };

  const addTag = (newTag: string) => {
    setArticleData({
      ...articleData,
      tag: '',
      tagList: [...articleData.tagList, newTag],
    });
  };

  const removeTag = (target: string) => {
    setArticleData({ ...articleData, tagList: articleData.tagList.filter((tag: string) => tag !== target) });
  };

  const updateArticleMutation = useUpdateArticleMutation();

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { slug, title, description, body, tagList } = articleData;
    updateArticleMutation.mutate(
      { slug, title, description, body, tagList },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: [QUERY_ARTICLE_KEY] });
          const newSlug = res.data.article.slug;
          navigate(`/article/${newSlug}`, { state: newSlug });
        },
      },
    );
  };

  return (
    <>

      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4">
            Create a new Post
          </Typography>
          <Box component="form" onSubmit={onUpdate} noValidate sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              margin="normal"
              variant="outlined"
              placeholder="Title for your article"
              name="title"
              value={articleData.title}
              onChange={onChangeArticleData}

            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              variant="outlined"
              type="text"
              placeholder="Brief description of your post"
              name="description"
              value={articleData.description}
              onChange={onChangeArticleData}
            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              variant="outlined"
              type="text"
              placeholder="Detail of your post"
              name="body"
              multiline
              rows={6}
              value={articleData.body}
              onChange={onChangeArticleData}
            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              variant="outlined"
              type="text"
              placeholder="Add tags for your post"
              name="tag"
              value={articleData.tag}
              helperText="Separate tags by comma."
              onChange={onChangeArticleData}
              onKeyDown={onEnter}
            />
            {articleData.tagList.map((tag: string) => (
              <Chip key={tag} label={tag} onClick={() => removeTag(tag)} />
            ))}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Article
            </Button>
          </Box>
        </Box>
      </Container>
    </>

  );
};

export default EditArticlePage;
