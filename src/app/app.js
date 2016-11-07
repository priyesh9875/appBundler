import React from 'react';
import {render} from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';



import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Layouts
import Account from './layouts/Account';
import LoginPage from './layouts/LoginPage';

// Components
import Home from './components/Home';
import Download from './components/Download';
import About from './components/About';
import NotFoundPage from './components/NotFoundPage';

import ThemeDefault from './theme-default';
import cookie from 'react-cookie';


function requireAuth(nextState, replace) {
    if (cookie.load('user')) {
        // do nohing
    } else {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        });
    }
}

function checkLoggedIn(nextState, replace) {
    if (cookie.load('user')) {
        replace({
            pathname: '/app/',
            state: { nextPathname: nextState.location.pathname }
        });

    }
}


render(
        <MuiThemeProvider muiTheme={ThemeDefault}>
            <Router history={browserHistory}>
                <Route >
                    <Redirect from="/" to="/app"  />
                    <Route path="login" component={LoginPage} onEnter={checkLoggedIn}/>

                    <Route path="/app" component={Account} onEnter={requireAuth} >
                        <IndexRoute component={Home}/>
                        <Route path="download" component={Download} />
                        <Route path="About" component={About} />
                        <Route path="*" component={NotFoundPage} />
                    </Route>

                </Route>
            </Router>
        </MuiThemeProvider>,
    document.getElementById('root')
);