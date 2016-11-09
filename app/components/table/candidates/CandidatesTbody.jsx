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


        return  Object.keys(groupById).map(function (name) {
            return groupById[name].map(function (candidate, index) {
                var row = [];
                var key = self.generateId();
                if (index == 0) {
                    row.push(<td key={key} rowSpan={groupById[name].length}>{name}</td>)
                }
                Object.keys(candidates_header).map(function (key) {
                    var cellKey = self.generateId();
                    switch (key) {
                        case "status":
                            row.push(<td key={cellKey}>
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
                            </td>);
                            break;
                        case "source":
                            switch (candidate[key]) {
                                case "LINKEDIN":
                                    row.push(
                                        <td key={cellKey}>
                                            <a target="_blank" href={candidate["url"]}>
                                               LinkedIn
                                            </a>
                                        </td>);
                                    break;
                                case "FACEBOOK":
                                    row.push(
                                        <td key={cellKey}>
                                            <a target="_blank" href={candidate["url"]}>
                                                Facebook
                                            </a>
                                        </td>);
                                    break;
                                case "CUSTOM":
                                    row.push(
                                        <td key={cellKey}>
                                            <a target="_blank" href={candidate["url"]}>
                                                {candidate["matched_firm"]}
                                            </a>
                                        </td>);
                                    break;
                                case "EMAIL":
                                    row.push(<td key={cellKey}><a>Firm's Email</a></td>);
                                    break;
                                default:
                                    row.push(<td key={cellKey}></td>);
                                    break;
                            }
                            break;
                        default:
                            row.push(<td>{candidate[key]}</td>)
                    }
                });

                return <tr id={"candidate" + candidate["id"]}>{row}</tr>
            })

        });
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