import jwtDecode from "jwt-decode";
import {httpService} from "./http.service";
import {apiUrl} from "../config";

const apiEndpoint = apiUrl + "/login";
const tokenKey = "token";

export const authService = {
  login,
  logout,
  loginWithJwt,
  getCurrentUser,
  getJwt
};

async function login(email, password) {
  const {data: jwt} = await httpService.post(apiEndpoint, {email, password});
  return jwt;
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt).user;
  } catch (ex) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}
