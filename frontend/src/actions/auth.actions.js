import {authConstants} from '../constants';
import {authService} from '../services';
import {alertActions} from './';
import {history} from '../helpers';

export const authActions = {
  login,
  logout
};

function login(email, password) {
  return async dispatch => {
    dispatch(request({email}));
    try {
      const {token} = await authService.login(email, password);
      authService.loginWithJwt(token);
      const user = await authService.getCurrentUser();
      dispatch(success(user));
      history.push('/');
    } catch (ex) {
      dispatch(failure(ex));
      dispatch(alertActions.error({header: ex.message}));
    }
  };

  function request(user) {
    return {type: authConstants.LOGIN_REQUEST, user}
  }

  function success(user) {
    return {type: authConstants.LOGIN_SUCCESS, user}
  }

  function failure(error) {
    return {type: authConstants.LOGIN_FAILURE, error}
  }
}

function logout() {
  authService.logout();
  return {type: authConstants.LOGOUT};
}
