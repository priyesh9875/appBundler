import React, { Component } from 'react'
import { Link } from 'react-router';
import PageBase from './PageBase';
import MyFiles from './MyFiles';
import cookie from 'react-cookie';
import Download from './Download';

class Home extends Component {

    constructor(props, context) {
        super(props, context)
        this.state = {
            user: cookie.load('user'),
            value: []
        }
    }

    updateUser(user) {
        cookie.remove('user', { path: '/' })
        cookie.save('user', user, { path: '/' });
        this.setState({ user });
    }

    render() {

        return (
            <PageBase title={"Dashboard"} navigation={"Dashboard"} >
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <Download user = {this.state.user} updateUser={this.updateUser.bind(this) }/>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <MyFiles data={this.state.user.zipFiles} title="Recent files (latest in bottom)" user={this.state.user}  updateUser={this.updateUser.bind(this) }/>
                    </div>
                </div>
            </PageBase>
        )
    }
}

export default Home
