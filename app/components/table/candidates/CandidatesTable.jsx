import Reat, {PropTypes} from 'react'
import CandidatesThead from 'components/table/candidates/CandidatesThead.jsx'
import CandidatesTbody from 'components/table/candidates/CandidatesTbody.jsx'
import CandidatesTfoot from 'components/table/candidates/CandidatesTfoot.jsx'

export default class CandidatesTable extends Reat.Component {

    render() {
        return (
            <table className="ui center structured aligned celled right-definition unstackable table">
                <CandidatesThead
                    tableHeaders={this.props.candidatesHeaders}
                />
                <CandidatesTbody
                    queries={this.props.queries}
                    candidates={this.props.candidates}
                    candidatesHeaders={this.props.candidatesHeaders}
                    queriesHeaders={this.props.queriesHeaders}
                    onCandidateStatusChange={(id, status)=>this.props.onCandidateStatusChange(id, status)}
                />
                <CandidatesTfoot
                    onChangePage={(page)=>this.props.onChangePage(page)}
                    currentPage={this.props.currentPage}
                />

            </table>
        )
    }
}
CandidatesTable.propTypes = {
    candidatesHeaders: PropTypes.object.isRequired,
    queriesHeaders: PropTypes.object.isRequired,
    candidates: PropTypes.array.isRequired,
    queries: PropTypes.array.isRequired,
    onCandidateStatusChange: PropTypes.func.isRequired
};