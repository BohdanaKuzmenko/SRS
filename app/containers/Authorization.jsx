import React, {PropTypes} from 'react'
import Button from 'components/Button.jsx'
import {POST} from 'http/HTTP.jsx'
import {START_SESSION, LOGIN, TEST} from 'urls/Urls.jsx'
import sha256 from 'js-sha256'

export default class Authorization extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: null,
            password: null,
            authAllow: true
        }
    }

    shouldComponentUpdate(prevProps, prevState) {
        return !_.isEqual(this.state.authAllow, prevState.authAllow)
    }

    checkEnter(event){
        if (event.keyCode == 13) {
            this.onSubmit()
        }
    }

    onLogin(component, event) {
        var login = event.target.value;
        if (component.state.login != login) {
            component.setState({
                "login": _.isEmpty(login) ? null : login
            });
            component.forceUpdate()
        }
        component.checkEnter(event)
    }

    onPassWord(component,event) {
        var password = event.target.value;
        if (component.state.password != password) {
            component.setState({
                "password": _.isEmpty(password) ? null : password
            });
            component.forceUpdate()
        }
        component.checkEnter(event)
    }

    generateAuthObject(login, password) {
        return {
            "username": login,
            "password": password
        }
    }

    onSubmit() {
        var self = this;
        const {setAuthState} = this.props;
        if (!(_.isNull(this.state.login) || _.isNull(this.state.password))) {
            var contentType = 'application/x-www-form-urlencoded; charset=utf-8';
            var user = {username: self.state.login};
            POST(START_SESSION, user, contentType).then(function (data) {
                var skey = data['skey'];
                var rkey = data['rkey'];
                var baseEncodePass = sha256([skey, self.state.password].join(';'));
                var encodedPass = sha256([rkey, baseEncodePass].join(';'));
                var authData = self.generateAuthObject(self.state.login, encodedPass);
                POST(LOGIN, authData, contentType)
                    .then(
                        function (data) {
                            if (_.isEqual(data, '{status:"OK"}')) {
                                self.setState({"authData": true})
                                setAuthState(true, self.state.login);
                            }
                        },
                        function () {
                            self.setState({"authAllow": false})
                        })
            });
        }
    }

    render() {
        var divStyle = {
            height: "500px"
        };
        var authState = this.state.authAllow ?
            "" :
            (<div className="ui negative message">
                <div className="header">
                    Unable to log in.
                </div>
                <p>Please check that you have entered your login and password correctly.</p>
                <ul>
                    <li>Is the Caps Lock safely turned off?</li>
                    <li>Maybe you are using the wrong input language? (e.g. German vs. English)</li>
                    <li>Try typing your password in a text editor and pasting it into the "Password" field.</li>

                </ul>
            </div>);
        return (
            <div style={divStyle} className="ui middle aligned centered page grid ">
                <div className="left aligned seven wide column">
                    <div className="ui segment">
                        {authState}
                        <form className="ui large form">
                            <div className="login">
                                <div className="ui fluid input">

                                    <input
                                        key="login-area"
                                        type="text"
                                        placeholder="login"
                                        onKeyUp={this.onLogin.bind(this,this)}
                                    />

                                </div>
                            </div>
                            <br/>
                            <div className="fluid password">
                                <div className="ui fluid input">
                                    <input
                                        key="input password"
                                        type="password"
                                        placeholder="password"
                                        onKeyUp={this.onPassWord.bind(this,this)}
                                    />
                                </div>
                            </div>
                            <br/>
                            <Button buttonTitle={"Login"} submit={() => this.onSubmit(this)}/>
                        </form>
                    </div>
                </div>
            </div>

        )
    }
}

Authorization.propTypes = {
    setAuthState: PropTypes.func.isRequired,
};

