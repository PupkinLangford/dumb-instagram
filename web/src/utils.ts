import {IUser} from './types';

export const getCurrentUser = () =>
  JSON.parse(localStorage.getItem('user')!)?.id;

export const setLogin = (token: string, user: IUser) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getReferrer = (history: any) =>
  (history.location &&
    history.location.state &&
    history.location.state.referrer) ||
  '/'; //https://stackoverflow.com/questions/59803423/is-it-possible-to-pass-props-from-a-react-link-to-a-functional-component
