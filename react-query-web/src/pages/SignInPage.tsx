import { ACCESS_TOKEN_KEY } from '@/constants/token.contant';
import useInputs from '@/lib/hooks/useInputs';
import routerMeta from '@/lib/routerMeta';
import token from '@/lib/token';
import { postLogin } from '@/repositories/users/usersRepository';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';

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
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to={routerMeta.SignUpPage.path}>Not registered?</Link>
            </p>

            <ul className="error-messages">
              {error.email && <li>email {error.email}</li>}
              {error.password && <li>password {error.password}</li>}
              {error.emailOrPassword && <li>email or password {error.emailOrPassword}</li>}
            </ul>

            <form onSubmit={onLogin}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={signIndata.email}
                  onChange={onChangeSignInData}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                  name="password"
                  value={signIndata.password}
                  onChange={onChangeSignInData}
                />
              </fieldset>
              <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
