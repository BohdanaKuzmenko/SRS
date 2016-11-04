import React, {PropTypes} from 'react'
import InputField from 'components/InputField.jsx'
import Button from 'components/Button.jsx'
import {POST} from 'http/HTTP.jsx'
import {START_SESSION, LOGIN, TEST} from 'urls/Urls.jsx'
import sha256 from 'js-sha256'

export default class Authorization extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            login: null,
            password: null,
        }
    }

    onLogin(event) {
        var login = event.target.value;
        if (this.state.login != login) {
            this.setState({
                "login": _.isEmpty(login) ? null : login
            })
        }
    }

    onPassWord(event) {
        var password = event.target.value;
        if (this.state.password != password) {
            this.setState({
                "password": _.isEmpty(password) ? null : password
            })
        }
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
            var contentType = 'application/x-www-form-urlencoded; charset=utf-8'
            var user = {username: self.state.login};
            POST(START_SESSION, user, contentType).then(function (data) {
                var skey = data['skey'];
                var rkey = data['rkey'];
                var baseEncodePass = sha256([skey, self.state.password].join(';'));
                var encodedPass = sha256([rkey, baseEncodePass].join(';'));
                var authData = self.generateAuthObject(self.state.login, encodedPass);
                POST(LOGIN, authData, contentType).then(function (data) {
                    if (_.isEqual(data, '{status:"OK"}')) {
                        console.log(self.state.login)
                        setAuthState(true, self.state.login);
                    }
                })
            });
        }
    }

    render() {
        var divStyle = {
            height: "500px"
        };

        return (
            <div style={divStyle} className="ui middle aligned centered page grid ">
                <div className="left aligned seven wide column">
                    <div className="ui segment">
                        <form className="ui large form">
                            <div className="login">
                                <div className="ui fluid input">
                                    <InputField
                                        key="input login"
                                        inputType="text"
                                        placeholder="login"
                                        onBlur={(value)=>this.onLogin(value)}
                                    />
                                </div>
                            </div>
                            <br/>
                            <div className="fluid password">
                                <div className="ui fluid input">
                                    <InputField
                                        key="input password"
                                        inputType="password"
                                        placeholder="password"
                                        onBlur={(value) => this.onPassWord(value)}
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

