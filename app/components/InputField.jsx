import React, {PropTypes} from 'react'

export default class InputField extends React.Component {

    render() {
        const {inputType, defaultValue, placeholder, onBlur} = this.props;
        return (
            <input
                className="ui fluid input"
                type={inputType}
                placeholder={placeholder}
                onChange={onBlur}
            />
        )
    }
}

InputField.propTypes = {
    inputType: PropTypes.string.isRequired,
    defaultValue: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired
};