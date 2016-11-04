import Reat, {PropTypes} from 'react'
import UUID from 'uuid-js'

export default class CandidatesTbody extends Reat.Component {


    generateId() {
        var uuid4 = UUID.create();
        return uuid4.toString();
    }

    onStatusChange(id, status) {
        if (status) {
            this.setAccepted(id);
            this.props.onCandidateStatusChange(id, "ACCEPTED")
        }
        else {
            this.setRejected(id);
            this.props.onCandidateStatusChange(id, "REJECTED")
        }
    }

    setAccepted(id) {
        $("tr#candidate" + id + " button#reject").removeClass("negative");
        $("tr#candidate" + id + " button#approve").addClass("positive");
    }

    setRejected(id) {
        $("tr#candidate" + id + " button#reject").addClass("negative");
        $("tr#candidate" + id + " button#approve").removeClass("positive");
    }


    generateBody(queries, candidates, queries_header, candidates_header) {
        var self = this;
        var idToName = {};
        queries.map(function (person) {
            var person_name = Object.keys(queries_header).map(function (header) {

                return person[header]
            }).join(" ");
            idToName[person["id"]] = person_name
        });

        var groupById = {};

        candidates.map(function (candidate) {
            var id = candidate["query_id"].toString();
            var key = idToName[id];
            if (!_.contains(Object.keys(groupById), key)) {
                groupById[key] = [];
            }
            groupById[key].push(candidate);
        });


        var test = Object.keys(groupById).map(function (name) {
            return groupById[name].map(function (candidate, index) {
                var row = [];
                if (index == 0) {
                    row.push(<td rowSpan={groupById[name].length}>{name}</td>)
                }
                Object.keys(candidates_header).map(function (key) {
                    if (_.isEqual(key, "status")) {
                        row.push(<td>
                            <div className="ui buttons">
                                <button id="reject"
                                        className={_.isEqual(candidate['status'], "REJECTED") ?
                                            "ui negative button" :
                                            "ui button"}
                                        onClick={self.onStatusChange.bind(self, candidate["id"], false)}>
                                    Reject
                                </button>
                                <div className="or"></div>
                                <button id="approve"
                                        className={_.isEqual(candidate['status'], "ACCEPTED") ?
                                            "ui positive button" :
                                            "ui button"}
                                        onClick={self.onStatusChange.bind(self, candidate["id"], true)}>
                                    Accept
                                </button>
                            </div>
                        </td>)
                    } else {
                        row.push(<td>{candidate[key]}</td>)
                    }

                });

                return <tr id={"candidate" + candidate["id"]}>{row}</tr>
            })

        });
        return test


    }

    render() {
        var body = this.generateBody(this.props.queries, this.props.candidates,
            this.props.queriesHeaders, this.props.candidatesHeaders);
        return (
            <tbody>{body}</tbody>
        )
    }

}
CandidatesTbody.propTypes = {
    queries: PropTypes.array.isRequired,
    candidates: PropTypes.array.isRequired,
    candidatesHeaders: PropTypes.object.isRequired,
    queriesHeaders: PropTypes.object.isRequired,
    onCandidateStatusChange: PropTypes.func.isRequired
};