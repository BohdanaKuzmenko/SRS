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


        var queryInfoById = {};
        queries.map(function (person) {
            queryInfoById[person["id"]] = {};
            queryInfoById[person["id"]]["name"] = Object.keys(queries_header).map(function (header) {
                return person[header]
            }).join(" ");
            queryInfoById[person["id"]]["agency_name"] = person["agency_name"];
            queryInfoById[person["id"]]["firm_name"] = person["firm_name"];
            queryInfoById[person["id"]]["url"] = person["url"];


        });
        var groupById = {};

        candidates.map(function (candidate) {
            var id = candidate["query_id"];
            if (!_.contains(Object.keys(groupById), id)) {
                groupById[id] = [];
            }
            groupById[id].push(candidate);
        });

        return Object.keys(groupById).map(function (id) {
            return groupById[id].map(function (candidate, index) {
                var row = [];
                if (index == 0) {
                    row.push(<td key={self.generateId()} rowSpan={groupById[id].length}>{queryInfoById[id]["name"]}</td>)
                    row.push(<td key={self.generateId()} rowSpan={groupById[id].length}>{queryInfoById[id]["agency_name"]}</td>)
                    var url = queryInfoById[id]["url"].startsWith("http")? queryInfoById[id]["url"] : "http://" + queryInfoById[id]["url"]
                    row.push(<td key={self.generateId()} rowSpan={groupById[id].length}> <a target="_blank" href={url}>{queryInfoById[id]["firm_name"]}</a></td>)
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
                                            <a target="_blank" href={candidate["url"]}> LinkedIn</a>
                                        </td>);
                                    break;
                                case "FACEBOOK":
                                    row.push(
                                        <td key={cellKey}>
                                            <a target="_blank" href={candidate["url"]}>Facebook</a>
                                        </td>);
                                    break;
                                case "CUSTOM":
                                    row.push(
                                        <td key={cellKey}>
                                            <a target="_blank" href={candidate["url"]}>{candidate["matched_firm"]}</a>
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