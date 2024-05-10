import {
    NativeRouter as Router,
    Switch,
    Route,
} from 'react-router-native';
import React from 'react';

import Home from '../Home/Home.jsx';
import Login from '../Login/Login.jsx';
import BottomBar from '../BottomBar/BottomBar.jsx';
import Account from '../Account/Account.jsx';
import Discover from '../Discover/Discover.jsx';
import SignUp from '../SignUp/SignUp.jsx';

class HobNob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: true
        };
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    logIn() {
        this.setState({isLoggedIn: true});
    }

    logOut() {
        this.setState({isLoggedIn: false});
    }

    render() {
        console.log('hobnob')
        return (
            <div id='main-container'>
                <Router>
                    <Switch>
                        <Route exact path="/">
                            {this.state.isLoggedIn ? <Redirect to="/home" /> : <Redirect to="/login" />}
                        </Route>
                        <Route path="/login">
                            {this.state.isLoggedIn ? <Redirect to="/home" /> : <Login />}
                        </Route>
                        <Route path="/signup">
                            {this.state.isLoggedIn ? <Redirect to="/home" /> : <SignUp />}
                        </Route>
                        <Route path="/home">
                            {this.state.isLoggedIn ? <Home /> : <Redirect to="/login" />}
                        </Route>
                        <Route path="/account">
                            {this.state.isLoggedIn ? <Account /> : <Redirect to="/login" />}
                        </Route>
                        <Route path="/discover">
                            {this.state.isLoggedIn ? <Discover /> : <Redirect to="/login" />}
                        </Route>
                    </Switch>
                </Router>
                {(this.state.isLoggedIn) ? (
                    <BottomBar />
                ) : (
                    <div/>
                )}
            </div>
        );
    }
}

export default HobNob;