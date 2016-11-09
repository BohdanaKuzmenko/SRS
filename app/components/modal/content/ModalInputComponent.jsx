import React, {PropTypes} from 'react'
import InputField from 'components/InputField.jsx'
export default class ModalInputComponent extends React.Component {

    constructor(props) {
        super(props)
    }


    render() {
        return (
            <div className="ui row">
                <div className="six wide right aligned column">
                    <div className="ui text">
                        {this.props.fieldTitle}
                        <span>{(this.props.important)?"*":""}</span>
                    </div>
                </div>
                <div className="six wide column">
                    <div className="ui inline fluid input field">
                        <InputField
                            inputType="text"
                            placeholder=""
                            onBlur={(event)=>this.props.onChangeField(event)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
ModalInputComponent.propTypes={
    fieldTitle: PropTypes.string.isRequired,
    onChangeField: PropTypes.func.isRequired,
    important: PropTypes.bool.isRequired
};