import React from 'react'
import CandidatesTable from 'components/table/candidates/CandidatesTable.jsx'
import {GET, POST, DELETE, PATCH} from 'http/HTTP.jsx'
import {QUERY, CANDIDATES} from 'urls/Urls.jsx'

export default class PossibleMatches extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queries: null,
            candidates: null,
            candidatesHeaders: {
                "matched_token": {"label": "Text Matches"},
                "url": {"label": "Source"},
                "status": {"label": "Match Status"}
            },
            queriesHeaders: {
                "first_name": {"label": "First Name"},
                "middle_name": {"label": "Middle_Name"},
                "last_name": {"label": "Last_Name"}
            }
        }
    }

    componentWillMount() {
        var self = this;
        GET(QUERY + "/?viewAll=true").then(function (data) {
            self.setState({
                "queries": data
            })

        });
        GET(CANDIDATES).then(function (data) {
            self.setState({"candidates": data})
        })
    }

    onCandidateStatusChange(id, status) {
        PATCH(CANDIDATES + "/" + id + "?status=" + status).then(function(){console.log("ok")})
    }


    render() {
        if (_.isNull(this.state.queries) || _.isNull(this.state.candidates)) {
            return (
                <div>
                    <div id="center-loader" className="ui grid">
                        <div className="column">
                            <div className="ui active inverted dimmer">
                                <div className="ui massive text loader">Loading</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div id="matches">

                <CandidatesTable
                    candidatesHeaders={this.state.candidatesHeaders}
                    queriesHeaders={this.state.queriesHeaders}
                    candidates={this.state.candidates}
                    queries={this.state.queries}
                    onCandidateStatusChange={(id, status)=> this.onCandidateStatusChange(id, status)}
                />

            </div>
        )
    }
}