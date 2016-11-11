import React, {PropTypes} from 'react'
export default class ModalWindow extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        $('.ui.modal#' + this.props.id).modal({detachable: false});
    }

    closeModalWindow(){
        $('#' + this.props.id).modal('toggle');
    }



    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps)
    }


    render() {
        return (
            <div>
                <div className="ui modal" id={this.props.id}>
                    <div className="header">
                        <div className="ui grid">
                            <div className="ui row">
                                <div className="ui column six wide left aligned left floated">
                                    {this.props.header}
                                </div>
                                <div className="ui column three wide right aligned right floated">
                                    <i className="close icon" onClick={this.closeModalWindow.bind(this)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content">{this.props.content}</div>
                </div>
            </div>
        )
    }
}
ModalWindow.propTypes = {
    id: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    content: PropTypes.any.isRequired
};