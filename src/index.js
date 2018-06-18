import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {HashRouter, Route, Switch} from 'react-router-dom';
import configureStore from './store/index';


const store = configureStore();

const rootEl = document.getElementById('app-site');

let render = () => {

    const App = require('./containers/App').default;

    ReactDOM.render(
        <Provider store={store}>
            <HashRouter basename="/">
                <Switch>
                    <Route path="/" component={App}/>
                </Switch>
            </HashRouter>
        </Provider>,
        rootEl
    );
};

if (module.hot) {
    module.hot.accept('./containers/App', () => {
        setTimeout(render);
    });
}
render();
