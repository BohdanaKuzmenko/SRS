import React, {PropTypes} from 'react'

export default class InputField extends React.Component {

    render() {
        const {inputType, placeholder, onChange} = this.props;
        return (
            <input
                className="ui fluid input"
                type={inputType}
                placeholder={placeholder}
                onChange={onChange}
            />
        )
    }
}

InputField.propTypes = {
    inputType: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};