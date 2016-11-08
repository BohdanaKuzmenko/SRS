import React, {PropTypes} from 'react'
export default class ModalWindow extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        $('.ui.modal#' + this.props.id).modal({detachable: false});
    }


    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps)
    }


    render() {
         return (
            <div>
                <div className="ui modal" id={this.props.id}>
                    <div className="header">{this.props.header}</div>
                    <div className="content">{this.props.content}</div>
                </div>
            </div>
        )
    }
}
ModalWindow.propTypes={
    id: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    content: PropTypes.any.isRequired
};