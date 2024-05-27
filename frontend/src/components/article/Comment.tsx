import {
  useCreateCommentMutation,
  // useDeleteCommentMutation
} from '@/queries/articles.query';
import { useGetUserQuery } from '@/queries/user.query';
import useInputs from '@/lib/hooks/useInputs';
import queryClient from '@/queries/queryClient';
import { QUERY_COMMENTS_KEY } from '@/constants/query.constant';
import convertToDate from '@/lib/utils/convertToDate';
import { IComment } from '@/interfaces/main';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid, Avatar, Typography } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ImageIcon from '@mui/icons-material/Image';
import { useState } from 'react';
// import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
// import { styled } from '@mui/material/styles';

interface ICommentProps {
  comments: IComment[];
  slug: string;
}

const Comment = ({ comments, slug }: ICommentProps) => {
  const { data } = useGetUserQuery();
  const [newComment, onChangeNewComment, setNewComment] = useInputs({ body: '' });
  const createCommentMutation = useCreateCommentMutation();
  const [error, setError] = useState({
    body: '',
  });

  const isFormValid = () => {
    return newComment.body.length > 0;
  };
  // const deleteCommentMutation = useDeleteCommentMutation();

  const onPostComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { body } = newComment;
    createCommentMutation.mutate(
      { body, slug },
      {
        onSuccess: () => {
          setNewComment({ body: '', slug });
          queryClient.invalidateQueries({ queryKey: [QUERY_COMMENTS_KEY] });
        },
        onError(error: any) {
          setError({
            body: error.response.data.errors.body,
          });
          console.log(error.response);
        },
      },
    );
  };

  // const onDelete = (slug: string, id: number) => {
  //   deleteCommentMutation.mutate(
  //     { slug, id },
  //     {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries({ queryKey: [QUERY_COMMENTS_KEY] });
  //       },
  //     },
  //   );
  // };

  return (
    <>
      <Box component="form" onSubmit={onPostComment} noValidate sx={{ mt: 1 }}>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          multiline
          rows={2}
          placeholder="Write a comment..."
          name="body"
          value={newComment.body}
          onChange={onChangeNewComment}
          error={error.body ? true : false}
          helperText={error.body ? error.body : ''}
        />
        <Grid container alignItems="center" spacing={0}>
          <Grid item>
            <Avatar alt="Avatar" src={data.image} sx={{ width: 36, height: 36 }} />
          </Grid>
          <Grid item>
            <Button type="submit" disabled={!isFormValid()}>Post Comment</Button>
          </Grid>
        </Grid>
      </Box>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <Typography variant="h6">Comments!</Typography>
        {comments.map((comment, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar src={comment.author.image} alt={comment.author.username}>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={comment.body} secondary={convertToDate(comment.updatedAt)} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Comment;
