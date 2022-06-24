import React, {
  useCallback,
  useState,
  useEffect,
} from 'react';
import { Grid } from '@mui/material';
import { Error } from 'types/yup';
import Input from 'components/input/input';
import userSlice from 'store/user/user.slice';
import Button from 'components/button/button';
import { useDispatch, useSelector } from 'react-redux';
import { tokenSelector } from 'store/user/user.selector';
import ErrorMessage from 'components/error-message/error-message';
import { useLocation, useNavigate } from 'react-router-dom';
import { SHOWS_URL } from 'screens/shows/shows.type';
import { USER_TOKEN_COOKIE } from 'store/user/user.type';
import { Wrapper } from './login.styled';
import { loginSchema } from './login.schema';
import { errorSelector } from '../../store/user/user.selector';

export default function Form() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const token = useSelector(tokenSelector);
  const userError = useSelector(errorSelector);
  const navigate = useNavigate();
  const from = useLocation();

  const handleChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      setData((prevData) => ({
        ...prevData,
        [target.name]: target.value,
      }));
    },
    [setData],
  );

  const resetError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
    },
    [],
  );

  const handleSend = useCallback(
    async () => {
      try {
        await loginSchema.validate(data);
        resetError('');
        dispatch(userSlice.actions.authentication(data));
      } catch (yupError: unknown) {
        setError((yupError as Error).errors[0]);
      }
    },
    [data],
  );

  useEffect(
    () => {
      if (token) {
        navigate(SHOWS_URL, {
          state: { from },
        });
      }
    },
    [token],
  );

  useEffect(
    () => {
      const localToken = localStorage.getItem(USER_TOKEN_COOKIE);
      if (localToken) {
        dispatch(userSlice.actions.setData({
          token: localToken,
        }));
      }
    },
    [],
  );

  return (
    <Wrapper
      container
      alignContent="center"
      justifyContent="center"
    >
      <Grid item xs={2}>

        <Input
          type="email"
          name="email"
          placeholder="E-mail"
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Senha"
          onChange={handleChange}
        />
        <ErrorMessage message={error || userError} />
        <Button onClick={handleSend}>Entrar</Button>

      </Grid>
    </Wrapper>
  );
}
