import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './containers/App';
import { store } from './helpers';
import { CookiesProvider } from 'react-cookie';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </CookiesProvider>,
    document.getElementById('root'),
);

serviceWorker.unregister();
