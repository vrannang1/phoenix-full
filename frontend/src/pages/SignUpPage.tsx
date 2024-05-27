import { ACCESS_TOKEN_KEY } from '@/constants/token.contant';
import useInputs from '@/lib/hooks/useInputs';
import routerMeta from '@/lib/routerMeta';
import token from '@/lib/token';
import { postRegister } from '@/repositories/users/usersRepository';
import { useState, useContext } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';
import { Link, useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const SignUpPage = () => {
  const [error, setError] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [signUpdata, onChangeSignUpData] = useInputs({ firstName: '', lastName: '', email: '', password: '' });
  const { setIsLogin } = useContext(UserContext);

  const navigate = useNavigate();

  const onRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postRegister(signUpdata)
      .then((res) => {
        if (res.data.errors) {
          setError({
            email: res.data.errors.email,
            password: res.data.errors.password,
            firstName: res.data.errors.firstName,
            lastName: res.data.errors.lastName
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
          firstName: err.response.data.errors.firstName,
          lastName: err.response.data.errors.lastName,
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
        <Box component="form" onSubmit={onRegister} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                variant="outlined"
                placeholder="Your firstName"
                name="firstName"
                value={signUpdata.firstName}
                onChange={onChangeSignUpData}
                error={error.firstName ? true : false}
                helperText={error.firstName ? error.firstName : ""}

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                variant="outlined"
                placeholder="Your lastName"
                name="lastName"
                value={signUpdata.lastName}
                onChange={onChangeSignUpData}
                error={error.lastName ? true : false}
                helperText={error.lastName ? error.lastName : ""}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                variant="outlined"
                placeholder="Your email address"
                name="email"
                value={signUpdata.email}
                onChange={onChangeSignUpData}
                error={error.email ? true : false}
                helperText={error.email ? error.email : ""}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                variant="outlined"
                type="password"
                placeholder="Your Password"
                name="password"
                value={signUpdata.password}
                onChange={onChangeSignUpData}
                error={error.password ? true : false}
                helperText={error.password ? error.password : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I agree to the terms and conditions."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link to={routerMeta.SignInPage.path}>
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;
