import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {authService} from "../services";


export const PublicRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    authService.getCurrentUser() ? <Redirect to={{pathname: '/', state: {from: props.location}}}/> : <Component {...props} />
  )}/>
);
