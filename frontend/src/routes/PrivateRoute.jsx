import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authService } from '../services';
//import Navigation from '../components/_shared/Navigation';
//import { Alert } from '../components/_shared/Alert';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            authService.getCurrentUser() ? (
                <Fragment>
                   {/* <Alert />
                    <Navigation /> */}
                    <Component {...props} {...rest} />
                </Fragment>
            ) : (
                <Redirect
                    to={{ pathname: '/map', state: { from: props.location } }}
                />
            )
        }
    />
);
