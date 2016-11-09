import {Component, PropTypes} from 'react'
import UUID from 'uuid-js'
import AcceptRejectButtonGroup from 'components/buttons/AcceptRejectButtonGroup.jsx'

export default class CandidatesTbody extends Component {


    generateId() {
        var uuid4 = UUID.create();
        return uuid4.toString();
    }

    generateBody(queries, candidates, queries_header, candidates_header) {
        var self = this;
        var idToName = {};
        queries.map(function (person) {
            idToName[person["id"]] = Object.keys(queries_header).map(function (header) {
                return person[header]
            }).join(" ");
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
                                <AcceptRejectButtonGroup key={self.generateId()}
                                    candidateStatus={candidate["status"]}
                                    candidateId={candidate["id"]}
                                    onCandidateStatusChange={(id, status)=>self.props.onCandidateStatusChange(id, status)}
                                />
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