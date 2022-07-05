import { createContext, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { CHECK_TOKEN } from '../graphql/queries';

export const AuthContextSchema = createContext({
  isAuth: null,
  email: null,
  _id: null,
  token: null,
  loggedIn: function () {},
  loggedOut: function () {},
});

function AuthContext(props) {
  const [checkToken, { data, loading, error }] = useLazyQuery(CHECK_TOKEN);
  
  const [state, setState] = useState({
    isAuth: false,
    token: '',
    email: '',
    _id: '',

    loggedIn: function (user) {
      checkToken({
        variables: { token: user.token },
        onCompleted: data => {
          setState(state => ({
            ...state,
            isAuth: true,
            token: user.token,
            email: user.email,
            _id: user._id,
          }));
        },
        onError: error => {
          console.log('error checkToken', error);
          setState(state => ({ ...state, isAuth: false, token: '' }));
        },
      });
    },

    loggedOut: function () {
      setState({ isAuth: false });
    },
  });

  return (
    <AuthContextSchema.Provider value={state}>
      {props.children}
    </AuthContextSchema.Provider>
  );
}

export default AuthContext;
