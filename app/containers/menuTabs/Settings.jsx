import React, {PropTypes} from 'react'
import InputField from 'components/InputField.jsx'
import Button from 'components/Button.jsx'
import {GET, PUT} from 'http/HTTP.jsx'
import {SETTINGS} from 'urls/Urls.jsx'

export default class Settings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            emailStatus: props.INPUT_EMAIL,
            checkDaysStatus: props.INPUT_CHECK_DAYS,
            email: null,
            checkDays: null,
        }
    }

    changeLabelClass(id, state) {
        switch (state) {
            case "negative":
                $("#" + id)
                    .removeClass("green")
                    .removeClass("blue")
                    .addClass("red");
                break;
            case "positive":
                $("#" + id)
                    .removeClass("red")
                    .removeClass("blue")
                    .addClass("green");
                break;
            case "neutral":
                $("#" + id)
                    .removeClass("red")
                    .removeClass("green")
                    .addClass("blue");
                break;
        }
    }

    validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validateCheckDays(value) {
        var re = /^\d+$/;
        return re.test(value);
        // return !isNaN(value)
    }

    shouldComponentUpdate(nextProps, nextState){
        return (!_.isEqual(this.state.email, nextState.email)) || (!_.isEqual(this.state.checkDays, nextState.checkDays))
    }


    onEmailEntered(email) {
        console.log(email)
        if (!_.isEmpty(email)) {
            if (this.validateEmail(email)) {
                this.setState({"email": email});
                if (this.state.emailStatus != this.props.EMAIL_SATISFIED) {
                    this.setState({"emailStatus": this.props.EMAIL_SATISFIED});
                    this.changeLabelClass("email-input", "positive")
                }
            }
            else {
                this.setState({"email": null})
                if (this.state.emailStatus != this.props.WRONG_EMAIL) {
                    this.setState({"emailStatus": this.props.WRONG_EMAIL});
                    this.changeLabelClass("email-input", "negative");
                }
            }
        }
        else {
            this.setState({"email": null})
            if (this.state.emailStatus != this.props.INPUT_EMAIL) {
                this.setState({"emailStatus": this.props.INPUT_EMAIL});
                this.changeLabelClass("email-input", "neutral");
            }
        }
    }

    onCheckingPeriodEntered(days) {
        if (!_.isEmpty(days)) {
            if (this.validateCheckDays(days)) {
                this.setState({"checkDays": days})
                if (this.state.checkDaysStatus != this.props.CHECK_DAYS_SATISFIED) {
                    this.setState({"checkDaysStatus": this.props.CHECK_DAYS_SATISFIED});
                    this.changeLabelClass("check-days-input", "positive");
                }
            }
            else {
                this.setState({"checkDays": null})
                if (this.state.checkDaysStatus != this.props.WRONG_CHECK_DAYS) {
                    this.setState({"checkDaysStatus": this.props.WRONG_CHECK_DAYS});
                    this.changeLabelClass("check-days-input", "negative");
                }
            }
        }
        else {
            this.setState({"checkDays": null})
            if (this.state.checkDaysStatus != this.props.INPUT_CHECK_DAYS) {
                this.setState({"checkDaysStatus": this.props.INPUT_CHECK_DAYS});
                this.changeLabelClass("check-days-input", "neutral");
            }
        }
    }


    approveSettings() {
        if (!_.isNull(this.state.email) && !_.isNull(this.state.checkDays)){
            console.log("Approve")
            var url = SETTINGS + "/?username=" + this.props.userName;
            var settings = {
                "email":this.state.email,
                "recheck_interval": this.state.checkDays
            };
            PUT(url, JSON.stringify(settings)).then(function (data) {})
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
                self.onEmailEntered(email)
                self.onCheckingPeriodEntered(checkDays.toString())

            })
    }


    render() {

        return (
            <div>
                <div className="ui grid">

                    <div className="column">
                        <div id="email" className="ui inline input field">
                            <InputField
                                inputType="text"
                                placeholder=""
                                onBlur={(event)=>this.onEmailEntered(event.target.value)}
                            />
                            <div id="email-input" className="ui left pointing blue basic label">
                                {this.state.emailStatus}
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <div id="checkDays" className="ui inline input field">
                            <InputField
                                inputType="text"
                                placeholder=""
                                onBlur={(event)=>this.onCheckingPeriodEntered(event.target.value)}
                            />
                            <div id="check-days-input" className="ui left pointing blue basic label">
                                {this.state.checkDaysStatus}
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
    INPUT_EMAIL: "Input emails for alerts",
    EMAIL_SATISFIED: "Email satisfied",
    WRONG_EMAIL: "Wrong email, try another one",
    INPUT_CHECK_DAYS: "Input checking period",
    CHECK_DAYS_SATISFIED: "Check days field is valid",
    WRONG_CHECK_DAYS: "Only numbers required",
};

Settings.propTypes = {
    userName: PropTypes.string.isRequired
};
