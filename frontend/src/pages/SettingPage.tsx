import SettingForm from '@/components/SettingForm';
import { ACCESS_TOKEN_KEY } from '@/constants/token.contant';
import token from '@/lib/token';
import { useGetUserQuery } from '@/queries/user.query';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const SettingPage = () => {
  const navigate = useNavigate();
  const { setIsLogin } = useContext(UserContext);
  const onLogout = () => {
    token.removeToken(ACCESS_TOKEN_KEY);
    setIsLogin(false);
    navigate('/');
  };

  const { data } = useGetUserQuery();

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          Settings
        </Typography>
        <SettingForm data={data} />
        <Button variant="outlined" onClick={onLogout} size="small" color="error">
          click here to logout.
        </Button>
      </Box>
    </Container>
  );
};

export default SettingPage;
