import { QUERY_USER_KEY } from '@/constants/query.constant';
import useInputs from '@/lib/hooks/useInputs';
import queryClient from '@/queries/queryClient';
// import { usePutUserMutation } from '@/queries/user.query';
import { putUser } from '@/repositories/users/usersRepository';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
      <ul className="error-messages">
        {error.password && <li>password {error.password}</li>}
      </ul>
      <form onSubmit={onUpdateSetting}>
        <fieldset>
          <fieldset className="form-group">
            <input
              className="form-control"
              type="file"
              placeholder="URL of profile picture"
              name="photoUrl"
              accept="image/*"
              // value={userData.image}
              onChange={onChangeUserData}
            />
            <img src={userData.image} width="80" height="80" alt={userData.username} />
          </fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Your Name"
              name="username"
              value={userData.username}
              onChange={onChangeUserData}
            />
          </fieldset>
          <fieldset className="form-group">
            <textarea
              className="form-control form-control-lg"
              rows={8}
              placeholder="Short bio about you"
              name="bio"
              value={userData.bio || ''}
              onChange={onChangeUserData}
            ></textarea>
          </fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={onChangeUserData}
            />
          </fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="Password"
              autoComplete="off"
              name="password"
              value={userData.password}
              onChange={onChangeUserData}
            />
            <small className="text-muted">Password is required to update Profile.</small>
          </fieldset>
          <button type="submit" className="btn btn-lg btn-primary pull-xs-right" disabled={!isFormValid()}>
            Update Settings
          </button>
        </fieldset>
      </form>
    </>
  );
};

export default SettingForm;
