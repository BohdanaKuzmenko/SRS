import {Component, PropTypes} from 'react'

export default class AcceptRejectButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidateStatus: this.props.candidateStatus

        }
    }

    onStatusChange(status) {
        this.props.onCandidateStatusChange(this.props.candidateId, status);
        this.setState({candidateStatus: status})


    }

    render() {
        var acceptButtonClass = _.isEqual(this.state.candidateStatus, "REJECTED") ?
            "ui negative button" :
            "ui button";
        var rejectButtonClass = _.isEqual(this.state.candidateStatus, "ACCEPTED") ?
            "ui positive button" :
            "ui button";

        return (
            <div className="ui buttons">
                <button id="reject"
                        className={acceptButtonClass}
                        onClick={this.onStatusChange.bind(this, "REJECTED")}>
                    Reject
                </button>
                <div className="or" onClick={this.onStatusChange.bind(this, "NONE")}>></div>
                <button id="approve"
                        className={rejectButtonClass}
                        onClick={this.onStatusChange.bind(this, "ACCEPTED")}>
                    Accept
                </button>
            </div>
        )
    }
}

AcceptRejectButtonGroup.propTypes = {
    candidateStatus: PropTypes.string.isRequired,
    candidateId: PropTypes.number.isRequired,
    onCandidateStatusChange: PropTypes.func.isRequired
};