import React, {PropTypes} from 'react'
import InputField from 'components/InputField.jsx'
import Button from 'components/buttons/Button.jsx'
import {GET, PUT} from 'http/HTTP.jsx'
import {SETTINGS} from 'urls/Urls.jsx'

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailStatus: null,
            checkDaysStatus: null,
            email: null,
            checkDays: null,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(this.state.email, nextState.email)) ||
            (!_.isEqual(this.state.checkDays, nextState.checkDays)) ||
            (!_.isEqual(this.state.emailStatus, nextState.emailStatus)) ||
            (!_.isEqual(this.state.checkDaysStatus, nextState.checkDaysStatus))
    }

    validateInput(value, regex){
        return regex.test(value)
    }

    checkInput(value, regexToValidate, stateElement, statusStateElement, wrongInputMessage, emptyInputMessage){
        if (!_.isEmpty(value)) {
            if (this.validateInput(value, regexToValidate)) {
                this.setState({[stateElement]: value});
                if (this.state[statusStateElement] != null) {
                    this.setState({[statusStateElement]: null});
                }
            }
            else {
                this.setState({[stateElement]: null});
                if (this.state[statusStateElement] != wrongInputMessage) {
                    this.setState({[statusStateElement]: wrongInputMessage});
                }
            }
        }
        else {
            this.setState({[stateElement]: null});
            if (this.state[statusStateElement]!= emptyInputMessage) {
                this.setState({[statusStateElement]: emptyInputMessage});
            }
        }
    }

    onEmailEntered(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var wrongEmail = this.props.WRONG_EMAIL;
        var emptyEmail = this.props.INPUT_EMAIL;
        this.checkInput(email, regex, "email", "emailStatus", wrongEmail, emptyEmail)
    }

    onCheckingPeriodEntered(days) {
        var regex = /^\d+$/;
        var wrongCheckDays = this.props.WRONG_CHECK_DAYS;
        var emptyCheckDays = this.props.INPUT_CHECK_DAYS;
        this.checkInput(days, regex, "checkDays", "checkDaysStatus", wrongCheckDays, emptyCheckDays)
    }

    approveSettings() {
        if (!_.isNull(this.state.email) && !_.isNull(this.state.checkDays)) {
            var url = SETTINGS + "/?username=" + this.props.userName;
            var settings = {
                "email": this.state.email,
                "recheck_interval": this.state.checkDays
            };
            PUT(url, JSON.stringify(settings)).then(function (data) {
            })
        }
    }

    componentDidMount() {
        var self = this;
        GET(SETTINGS + "/?username=" + this.props.userName)
            .then(function (settings) {
                var email = (_.isNull(settings["email"])) ? "" : settings["email"];
                var checkDays = (_.isNull(settings["recheck_interval"])) ? "" : settings["recheck_interval"];

                $('#email').find('input:text').val(email);
                $('#checkDays').find('input:text').val(checkDays);
                self.onEmailEntered(email);
                self.onCheckingPeriodEntered(checkDays.toString())
            })
    }


    render() {
        var emailStatus = (_.isNull(this.state.emailStatus)) ?
            "" :
            <div id="email-input" className={"ui left pointing " + this.state.emailStatus.status + " basic label"}>
                {this.state.emailStatus.label}
            </div>;

        var checkDaysStatus = (_.isNull(this.state.checkDaysStatus)) ?
            "" :
            <div id="check-days-input"
                 className={"ui left pointing " + this.state.checkDaysStatus.status + " basic label"}>
                {this.state.checkDaysStatus.label}
            </div>;

        return (
            <div>
                <div className="ui left aligned grid">
                    <div className="ui row">
                        <div className="two wide right aligned column">
                            <div className="ui text">
                                Notifications email:
                            </div>
                        </div>
                        <div className="six wide column">
                            <div id="email" className="ui inline input field">
                                <InputField
                                    inputType="text"
                                    placeholder=""
                                    onChange={(event)=>this.onEmailEntered(event.target.value)}
                                />
                                {emailStatus}
                            </div>
                        </div>
                    </div>
                    <div className="ui row">
                        <div className="two wide right aligned column">
                            <div className="ui text">
                                Recheck period (days):
                            </div>
                        </div>
                        <div className="six wide column">
                            <div id="checkDays" className="ui inline input field">
                                <InputField
                                    inputType="text"
                                    placeholder=""
                                    onChange={(event)=>this.onCheckingPeriodEntered(event.target.value)}
                                />
                                {checkDaysStatus}
                            </div>
                        </div>
                    </div>


                </div>
                <div className="submit-button">
                    <Button buttonTitle="Save" submit={this.approveSettings.bind(this)}/>
                </div>
            </div>
        )
    }
}

Settings.defaultProps = {
    INPUT_EMAIL: {label: "Input emails for alerts", status: "blue"},
    WRONG_EMAIL: {label: "Wrong email, try another one", status: "red"},
    INPUT_CHECK_DAYS: {label: "Input checking period", status: "blue"},
    WRONG_CHECK_DAYS: {label: "Only numbers required", status: "red"},
};

Settings.propTypes = {
    userName: PropTypes.string.isRequired
};
