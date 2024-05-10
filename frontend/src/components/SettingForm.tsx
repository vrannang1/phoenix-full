import { QUERY_USER_KEY } from '@/constants/query.constant';
import useInputs from '@/lib/hooks/useInputs';
import queryClient from '@/queries/queryClient';
// import { usePutUserMutation } from '@/queries/user.query';
import { putUser } from '@/repositories/users/usersRepository';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

interface ISettingFormProps {
  data: { [key: string]: string | number };
}

const SettingForm = ({ data }: ISettingFormProps) => {
  const [error, setError] = useState({
    password: '',
  });
  const navigate = useNavigate();
  const [userData, onChangeUserData] = useInputs({
    email: data.email,
    username: data.username,
    bio: data.bio,
    photoUrl: {},
    image: data.image,
    password: '',
  });

  const isFormValid = () => {
    return userData.password.length > 0;
  };

  // const putUserMutation = usePutUserMutation();

  const onUpdateSetting = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    putUser({ user: userData })
      .then((res) => {
        if (res.data.errors) {
          setError({
            password: res.data.errors.current_password,
          });
        } else {
          queryClient.invalidateQueries({ queryKey: [QUERY_USER_KEY] });
          navigate('/', { replace: true });
        }
        console.log('res from putUser', res);
      })
      .catch((err) => {
        setError({
          password: err.response.data.errors.current_password,
        });
      });
  };

  return (
    <>
      <Box component="form" onSubmit={onUpdateSetting} noValidate sx={{ mt: 1 }}>
        <Grid container alignItems="center" spacing={0.5}>
          <Grid item>
            <Avatar alt="Avatar" src={userData.image} sx={{ width: 48, height: 48 }} />
          </Grid>
          <Grid item>
            <Button
              component="label"
              size="small"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" name="photoUrl" accept="image/*" onChange={onChangeUserData} />
            </Button>
          </Grid>
        </Grid>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          placeholder="Username"
          name="username"
          value={userData.username}
          onChange={onChangeUserData}
        />
        <TextField
          fullWidth
          size="small"
          type="email"
          margin="normal"
          variant="outlined"
          placeholder="email"
          name="email"
          value={userData.email}
          onChange={onChangeUserData}
        />
        <TextField
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          multiline
          rows={6}
          placeholder="A short bio"
          name="bio"
          value={userData.bio || ''}
          onChange={onChangeUserData}
        />
        <TextField
          fullWidth
          type="password"
          size="small"
          margin="normal"
          variant="outlined"
          placeholder="Password"
          name="password"
          value={userData.password}
          onChange={onChangeUserData}
          error={error.password ? true : false}
          helperText={error.password ? "Password " + error.password : "* Password is required to update settings"}
        />
        <Button type="submit" variant="contained" disabled={!isFormValid()}>Update Settings</Button>
      </Box>
    </>
  );
};

export default SettingForm;
