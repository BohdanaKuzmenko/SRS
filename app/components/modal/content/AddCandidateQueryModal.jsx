import React from 'react'
import Button from 'components/buttons/Button.jsx'
import ModalInputComponent from 'components/modal/content/ModalInputComponent.jsx'

export default class AddCandidateQueryModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: {label: "First Name", value: null, valid: true, important: true},
                lastName: {label: "Last Name", value: null, valid: true, important: true},
                middleName: {label: "Middle Name", value: "", valid: true, important: false},
                url: {label: "Url", value: null, valid: true, important: true},
                firmName: {label: "Company Name", value: null, valid: true, important: true},
                agencyName: {label: "Client Name", value: null, valid: true, important: true},
                backdoor: {label: "", value: false, valid: true, important: false}
            }
        }
    }

    onInputChange(event, field_name) {
        var user = $.extend({}, this.state.user);
        var defaultValue = user[field_name]["important"] ? null : "";
        user[field_name]["value"] = (_.isEmpty(event.target.value)) ? defaultValue : event.target.value;
        user[field_name]["valid"] = !(user[field_name]["important"] && _.isNull(user[field_name]["value"]))
        if (this.state.user != user) {
            this.setState({
                "user": user
            })
        }
    }

    onSubmit() {
        var self = this;
        var invalid_field = [];
        var user = $.extend({}, this.state.user);

        Object.keys(this.state.user).map(function (key) {
            if (self.state.user[key]["important"]) {
                if (_.isNull(self.state.user[key]["value"])) {
                    invalid_field.push(key);
                    user[key]["valid"] = false
                }
            }

        });
        if (_.isEmpty(invalid_field)) {
            var exportUser = {};
            Object.keys(this.state.user).map(function (key) {
                exportUser[key] = self.state.user[key]["value"]
            });
            this.props.func(exportUser);
            this.setState({
                "user": {
                    firstName: {label: "First Name", value: null, valid: true, important: true},
                    lastName: {label: "Last Name", value: null, valid: true, important: true},
                    middleName: {label: "Middle Name", value: "", valid: true, important: false},
                    url: {label: "Url", value: "", valid: true, important: true},
                    firmName: {label: "Company Name", value: null, valid: true, important: true},
                    agencyName: {label: "Client Name", value: null, valid: true, important: true},
                    backdoor: {label: "", value: false, valid: true, important: false}
                }
            });
            $('#user-form').find('input:text').val('');
            $('#' + this.props.id)
                .modal('toggle')
            ;
        }
        else {
            this.setState({
                "user": user
            })
        }
    }

    // shouldComponentUpdate(props, state){
    //     return !_.isEqual(this.state.user, state.user)
    // }

    render() {
        var self = this;
        var fields = Object.keys(this.state.user).map(function (key) {
            if (!_.isEqual(key, "backdoor")) {
                var className = (self.state.user[key]["valid"]) ?
                    "ui inline fluid input field" :
                    "ui inline fluid input error field";
                return (
                    <ModalInputComponent key={key}
                                         fieldTitle={self.state.user[key]["label"]}
                                         onChangeField={(value)=>self.onInputChange(value, key)}
                                         important={self.state.user[key]["important"]}
                                         className={className}
                    />
                )
            }
        });


        return (
            <div>
                <div id="user-form" className="ui grid">
                    {fields}
                    <div className="ui row">
                        <div className="sixteen wide center aligned column">
                            <Button buttonTitle="Save" submit={this.onSubmit.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}