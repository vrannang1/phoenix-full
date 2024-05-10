import { ACCESS_TOKEN_KEY } from '@/constants/token.contant';
import useInputs from '@/lib/hooks/useInputs';
import routerMeta from '@/lib/routerMeta';
import token from '@/lib/token';
import { postLogin } from '@/repositories/users/usersRepository';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const SignInPage = () => {
  const [error, setError] = useState({
    email: '',
    password: '',
    emailOrPassword: '',
  });

  const [signIndata, onChangeSignInData] = useInputs({ email: '', password: '' });
  const { setIsLogin } = useContext(UserContext);

  const navigate = useNavigate();

  const onLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postLogin(signIndata)
      .then((res) => {
        if (res.data.errors) {
          setError({
            email: res.data.errors.email,
            password: res.data.errors.password,
            emailOrPassword: res.data.errors.emailOrPassword,
          });
        } else {
          token.setToken(ACCESS_TOKEN_KEY, res.data.user.token);
          setIsLogin(!!token.getToken(ACCESS_TOKEN_KEY));
          navigate('/', { replace: true });
        }
      })
      .catch((err) => {
        setError({
          email: err.response.data.errors.email,
          password: err.response.data.errors.password,
          emailOrPassword: err.response.data.errors['email or password'],
        });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={onLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            variant="outlined"
            placeholder="Your email address"
            name="email"
            value={signIndata.email}
            onChange={onChangeSignInData}
            error={error.emailOrPassword ? true : false}
            helperText={error.emailOrPassword ? "Invalid email or password" : ""}

          />
          <TextField
            fullWidth
            size="small"
            margin="normal"
            variant="outlined"
            type="password"
            placeholder="Your Password"
            name="password"
            value={signIndata.password}
            onChange={onChangeSignInData}
            error={Boolean(error.emailOrPassword)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="#0" >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to={routerMeta.SignUpPage.path}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInPage;
