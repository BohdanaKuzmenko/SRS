import React from 'react'
import Auth from 'containers/Authorization.jsx'
import MainView from 'containers/MainView.jsx'
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
            this.setState({"auth": authState, "userName":userName})
        }
    }



    render() {
        return <MainView
            userName="admin"
        />
        // return (this.state.auth)?
        //     <MainView
        //         userName={this.state.userName}
        //     />
        //     :
        //     (<Auth
        //         setAuthState={(state, user) => this.setAuthState(state, user)}
        //     />
        //     )
    }
}
