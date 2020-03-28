import axios from "axios";
import {logService} from "./";
import {authService} from './auth.service';

export const httpService = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt
};

const jwt = authService.getJwt();
if (jwt) httpService.setJwt(jwt);

axios.interceptors.response.use(null, error => {
  const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
  logService.log(error);
  if (expectedError) {
    error = error.response.data; // to return error obj with {message, error if exist}
  } else {
    error = {message: 'Internal Server Error! Please try again later.'};
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  axios.defaults.headers.common = {'Authorization': `bearer ${jwt}`, 'lon': '30.0054807', 'lat': '31.4655542'}
}
