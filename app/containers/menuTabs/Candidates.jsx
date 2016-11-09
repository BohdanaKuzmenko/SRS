import React from 'react'
import CandidatesTable from 'components/table/candidates/CandidatesTable.jsx'
import {GET, POST, DELETE, PATCH} from 'http/HTTP.jsx'
import {QUERY, CANDIDATES} from 'urls/Urls.jsx'

export default class Candidates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage:null,
            firstPage: null,
            previousPage: null,
            nextPage: null,
            lastPage: null,
            queries: null,
            candidates: null,
            candidatesHeaders: {
                "matched_token": {"label": "Text Matches"},
                "source": {"label": "Source"},
                "status": {"label": "Match Status"}
            },
            queriesHeaders: {
                "first_name": {"label": "First Name"},
                "middle_name": {"label": "Middle_Name"},
                "last_name": {"label": "Last_Name"}
            }
        }
    }

    setCandidates(url){
        var self = this;
        GET(url, true).then(function (data) {
            self.setState({
                "candidates": data['data'],
                "currentPage": parseInt(data['currentPage'])+1,
                "firstPage": data['firstPageUrl'],
                "previousPage": data['prevPageUrl'],
                "nextPage": data['nextPageUrl'],
                "lastPage": data['lastPageUrl']
            })
        })
    }

    componentWillMount() {
        var self = this;
        GET(QUERY + "/?viewAll=true").then(function (data) {
            self.setState({
                "queries": data
            })
        });
        this.setCandidates(CANDIDATES)
    }

    onCandidateStatusChange(id, status) {
        PATCH(CANDIDATES + "/" + id + "?status=" + status)
    }
    onChangePage(pageStatus) {

        switch (pageStatus) {
            case "first":
                if (!_.isNull(this.state.firstPage)) {
                    this.setCandidates(this.state.firstPage)
                }
                break;
            case "previous":
                if (!_.isNull(this.state.previousPage)) {
                    this.setCandidates(this.state.previousPage)
                }
                break;
            case "next":
                if (!_.isNull(this.state.nextPage)) {
                    this.setCandidates(this.state.nextPage)
                }
                break;
            case "last":
                if (!_.isNull(this.state.lastPage)) {
                    this.setCandidates(this.state.lastPage)
                }
                break;

        }
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
                    currentPage={this.state.currentPage}
                    candidates={this.state.candidates}
                    queries={this.state.queries}
                    onCandidateStatusChange={(id, status)=> this.onCandidateStatusChange(id, status)}
                    onChangePage={(status)=> this.onChangePage(status)}
                />

            </div>
        )
    }
}