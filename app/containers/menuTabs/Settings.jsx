import React, {PropTypes} from 'react'
import InputField from 'components/InputField.jsx'
import Button from 'components/Button.jsx'
import {GET, PUT} from 'http/HTTP.jsx'
import {SETTINGS} from 'urls/Urls.jsx'

export default class Settings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            emailStatus: null,
            checkDaysStatus: null,
            email: null,
            checkDays: null,
        }
    }

    changeLabelClass(id, state) {
        console.log("changeLabelClass")
        console.log(id)
        switch (state) {
            case "negative":
                console.log("negative")
                console.log($("#" + id))
                $("#" + id)
                    .removeClass("green")
                    .removeClass("blue")
                    .addClass("red")

                break;
            case "positive":
                console.log("positive")
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

    shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(this.state.email, nextState.email)) ||
            (!_.isEqual(this.state.checkDays, nextState.checkDays)) ||
            (!_.isEqual(this.state.emailStatus, nextState.emailStatus)) ||
            (!_.isEqual(this.state.checkDaysStatus, nextState.checkDaysStatus))
    }



    onEmailEntered(email) {
        if (!_.isEmpty(email)) {
            if (this.validateEmail(email)) {
                this.setState({"email": email});
                if (this.state.emailStatus != null) {
                    this.setState({"emailStatus": null});
                }
            }
        else{
            this.setState({"email": null});
            if (this.state.emailStatus != this.props.WRONG_EMAIL) {
                this.setState({"emailStatus": this.props.WRONG_EMAIL});
            }
        }
        }
        else {
            this.setState({"email": null});
            if (this.state.emailStatus != this.props.INPUT_EMAIL) {
                this.setState({"emailStatus": this.props.INPUT_EMAIL});
            }
        }
    }

    onCheckingPeriodEntered(days) {
        if (!_.isEmpty(days)) {
            if (this.validateCheckDays(days)) {
                this.setState({"checkDays": days});
                if (this.state.checkDaysStatus != null) {
                    this.setState({"checkDaysStatus": null});
                }
            }
        else {
            this.setState({"checkDays": null});
            if (this.state.checkDaysStatus != this.props.WRONG_CHECK_DAYS) {
                this.setState({"checkDaysStatus": this.props.WRONG_CHECK_DAYS});
            }
        }
        }
        else {
            this.setState({"checkDays": null});
            if (this.state.checkDaysStatus != this.props.INPUT_CHECK_DAYS) {
                this.setState({"checkDaysStatus": this.props.INPUT_CHECK_DAYS});
            }
        }
    }


    approveSettings() {
        if (!_.isNull(this.state.email) && !_.isNull(this.state.checkDays)) {
            console.log("Approve")
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
                self.onEmailEntered(email)
                self.onCheckingPeriodEntered(checkDays.toString())

            })
    }


    render() {
        var emailStatus = (_.isNull(this.state.emailStatus)) ?
            "" :
            <div id="email-input" className={"ui left pointing " +this.state.emailStatus.status+" basic label"}>
                {this.state.emailStatus.label}
            </div>;

        var checkDaysStatus = (_.isNull(this.state.checkDaysStatus)) ?
            "" :
            <div id="check-days-input"  className={"ui left pointing " +this.state.checkDaysStatus.status+" basic label"}>
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
                                    onBlur={(event)=>this.onEmailEntered(event.target.value)}
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
                                    onBlur={(event)=>this.onCheckingPeriodEntered(event.target.value)}
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
    INPUT_EMAIL: {label: "Input emails for alerts", status:"blue"},
    EMAIL_SATISFIED: {label: "Email satisfied", status:"green"},
    WRONG_EMAIL: {label: "Wrong email, try another one", status:"red"},
    INPUT_CHECK_DAYS: {label: "Input checking period", status:"blue"},
    CHECK_DAYS_SATISFIED: {label: "Check days field is valid", status:"green"},
    WRONG_CHECK_DAYS: {label: "Only numbers required", status:"red"},
};

Settings.propTypes = {
    userName: PropTypes.string.isRequired
};
