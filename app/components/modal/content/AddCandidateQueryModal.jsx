import React from 'react'
import Button from 'components/Button.jsx'
import ModalInputComponent from 'components/modal/content/ModalInputComponent.jsx'

export default class AddCandidatQueryModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: {
                firstName: null,
                lastName: null,
                middleName: "",
                url: null,
                firmName: null,
                agencyName: null,
                backdoor: false
            }
        }
    }

    onFirstName(event, field_name) {
        var user = $.extend({}, this.state.user);
        user[field_name] = (_.isEmpty(event.target.value)) ? null : event.target.value;
        if (this.state.user != user) {
            this.setState({
                "user": user
            })
        }
    }

    onSubmit() {
        var self = this;
        var user_init_completed = true;

        Object.keys(this.state.user).map(function (key) {
            if (!_.isEqual(key, 'middleName')){
                if (_.isNull(self.state.user[key])) {
                    user_init_completed = false
                }
            }

        });
        if (user_init_completed) {
            this.props.func(this.state.user);
            this.setState({
                "user": {
                    firstName: null,
                    lastName: null,
                    middleName: "",
                    url: null,
                    firmName: null,
                    agencyName: null,
                    backdoor: false
                }
            });
            $('#user-form').find('input:text').val('');
            $('#' + this.props.id)
                .modal('toggle')
            ;
        }
        else {
            console.log("not ok")
        }
    }

    render() {
        return (
            <div>
                <div id ="user-form" className="ui grid">
                    <ModalInputComponent
                        fieldTitle="First Name"
                        onChangeField={(value)=>this.onFirstName(value, "firstName")}
                        important={true}
                    />
                    <ModalInputComponent
                        fieldTitle="Last Name"
                        onChangeField={(value)=>this.onFirstName(value, "lastName")}
                        important={true}
                    />
                    <ModalInputComponent
                        fieldTitle="Middle Name&nbsp;&nbsp;"
                        onChangeField={(value)=>this.onFirstName(value, "middleName")}
                        important={false}
                    />
                    <ModalInputComponent
                        fieldTitle="Url"
                        onChangeField={(value)=>this.onFirstName(value, "url")}
                        important={true}
                    />
                    <ModalInputComponent
                        fieldTitle="Company Name"
                        onChangeField={(value)=>this.onFirstName(value, "firmName")}
                        important={true}
                    />
                    <ModalInputComponent
                        fieldTitle="Client Name"
                        onChangeField={(value)=>this.onFirstName(value, "agencyName")}
                        important={true}
                    />

                </div>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <div className="submit-button">
                    <Button buttonTitle="Save" submit={this.onSubmit.bind(this)}/>
                </div>
            </div>
        )
    }
}