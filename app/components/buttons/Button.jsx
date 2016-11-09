import React, {PropTypes} from "react"

export default class Button extends React.Component{
    render(){
        var {buttonTitle, submit} = this.props;
        return (
            <a className="ui vk button" onClick={submit}>
                <i>{buttonTitle}</i>
            </a>
        )
    }
}
Button.propTypes = {
    buttonTitle: PropTypes.string.isRequired,
    submit: PropTypes.func.isRequired
};