import useInputs from '@/lib/hooks/useInputs';
import queryClient from '@/queries/queryClient';
import { useCreateArticleMutation } from '@/queries/articles.query';
import { QUERY_ARTICLES_KEY } from '@/constants/query.constant';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
// import { ChildProcess } from 'child_process';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const NewArticlePage = () => {
  const [error, setError] = useState({
    title: '',
    body: '',
    tags: [],
  });
  const navigate = useNavigate();
  const [articleData, onChangeArticleData, setArticleData] = useInputs({
    title: '',
    photoUrl: {},
    // description: '',
    body: '',
    tag: '',
    tagList: [],
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

  const isFormValid = () => {
    return articleData.body.length > 0 && articleData.title.length > 0;
  };

  const createArticleMutation = useCreateArticleMutation();

  const onPublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, photoUrl, body, tagList } = articleData;
    createArticleMutation.mutate(
      { title, photoUrl, body, tagList },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: [QUERY_ARTICLES_KEY] });
          const slug = res.data.article.slug;
          navigate(`/article/${slug}`, { state: slug });
        },
        onError: (error: any) => {
          setError({
            title: error.response.data.errors.title[0],
            body: error.response.data.errors.body[0],
            tags: error.response.data.errors.tags,
          });
        },
      },
    );
  };

  return (
    <div className="editor-page">
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
          <Box component="form" onSubmit={onPublish} noValidate sx={{ mt: 1 }}>
            <Button component="label" size="large" role={undefined} variant="outlined" tabIndex={-1}>
              Add a cover image
              <VisuallyHiddenInput type="file" name="photoUrl" accept="image/*" onChange={onChangeArticleData} />
            </Button>

            <TextField
              fullWidth
              size="medium"
              margin="normal"
              variant="outlined"
              placeholder="Title for your article"
              name="title"
              value={articleData.title}
              onChange={onChangeArticleData}
              error={error.title ? true : false}
              helperText={error.title ? error.title : ''}
            />
            {/* <TextField
              fullWidth
              size="small"
              margin="normal"
              variant="outlined"
              type="text"
              placeholder="Brief description of your post"
              name="description"
              value={articleData.description}
              onChange={onChangeArticleData}
            /> */}
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
              error={error.body ? true : false}
              helperText={error.body ? error.body : ''}
            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              variant="outlined"
              type="text"
              placeholder="Add tags for your post"
              name="tag"
              error={articleData.tagList.length > 4}
              helperText={articleData.tagList.length > 4 ? 'You can only add 4 tags' : ''}
              value={articleData.tag}
              // helperText="Separate tags by comma."
              onChange={onChangeArticleData}
              onKeyDown={onEnter}
            />
            {articleData.tagList.map((tag: string) => (
              <Chip key={tag} label={tag} onClick={() => removeTag(tag)} />
            ))}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!isFormValid()}>
              Publish Article
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default NewArticlePage;
