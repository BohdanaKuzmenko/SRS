import React from 'react'
import Auth from 'containers/Authorization.jsx'
import MainView from 'containers/MainView.jsx'
import {GET} from 'http/HTTP.jsx'
import {GET_AUTH_USER} from 'urls/Urls.jsx'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            userName: null
        }
    }

    setAuthState(authState, userName) {
        if (!_.isEqual(this.state.auth, authState)) {
            this.setState({"auth": authState, "userName": userName})
        }
    }

    componentWillMount() {
        var self = this;
        GET(GET_AUTH_USER, false, false).then(function (data) {
            if (!_.isEqual(data.user, 'anonymousUser')){
                self.setState({"auth": true, "userName":data.user})
            }
        })
    }

    shouldComponentUpdate(prevProps, prevState){
        return (this.state.auth != prevState.auth)
    }


    render() {

        return (this.state.auth) ?
            <MainView
                userName={this.state.userName}
            />
            :
            (<Auth
                    setAuthState={(state, user) => this.setAuthState(state, user)}
                />
            )
    }
}
