import useInputs from '@/lib/hooks/useInputs';
import queryClient from '@/queries/queryClient';
import { useCreateArticleMutation } from '@/queries/articles.query';
import { QUERY_ARTICLES_KEY } from '@/constants/query.constant';
import { useNavigate, Link } from 'react-router-dom';

import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ChildProcess } from 'child_process';

const NewArticlePage = () => {
  const navigate = useNavigate();
  const [articleData, onChangeArticleData, setArticleData] = useInputs({
    title: '',
    description: '',
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

  const createArticleMutation = useCreateArticleMutation();

  const onPublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, description, body, tagList } = articleData;
    createArticleMutation.mutate(
      { title, description, body, tagList },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: [QUERY_ARTICLES_KEY] });
          const slug = res.data.article.slug;
          navigate(`/article/${slug}`, { state: slug });
        },
      },
    );
  };

  console.log("tagList", articleData.tag, articleData.tagList);

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
              Publish Article
            </Button>
          </Box>
        </Box>
      </Container>

      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form onSubmit={onPublish}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    name="title"
                    value={articleData.title}
                    onChange={onChangeArticleData}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    name="description"
                    value={articleData.description}
                    onChange={onChangeArticleData}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    name="body"
                    value={articleData.body}
                    onChange={onChangeArticleData}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    name="tag"
                    value={articleData.tag}
                    onChange={onChangeArticleData}
                    onKeyDown={onEnter}
                  />
                </fieldset>
                <div className="tag-list">
                  {articleData.tagList.map((tag: string) => (
                    <span className="tag-default tag-pill" key={tag}>
                      <i
                        role="presentation"
                        className="ion-close-round"
                        style={{ cursor: 'pointer', marginRight: '5px' }}
                        onClick={() => removeTag(tag)}
                      />{' '}
                      {tag}{' '}
                    </span>
                  ))}
                </div>
                <button className="btn btn-lg pull-xs-right btn-primary" type="submit">
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArticlePage;
