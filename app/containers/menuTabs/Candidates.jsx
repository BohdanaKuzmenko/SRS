import React from 'react'
import Table from 'components/table/queries/Table.jsx'
import {GET, POST, DELETE} from 'http/HTTP.jsx'
import {QUERY} from 'urls/Urls.jsx'
import ModalWindow from 'components/modal/ModalWindow.jsx'
import AddCandidateQueryModal from 'components/modal/AddCandidateQueryModal.jsx'
import FileUpload from 'components/modal/FileUpload.jsx'


export default class Candidates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queries: null,
            firstPage: null,
            previousPage: null,
            nextPage: null,
            lastPage: null,
            tableHeaders: {
                "first_name": {"field": "firstName", "label": "First Name", "sortIndex": null, "order": null},
                "last_name": {"field": "lastName", "label": "Last Name", "sortIndex": null, "order": null},
                "middle_name": {"field": "middleName", "label": "Middle Name", "sortIndex": null, "order": null},
                "matches_found": {"field": "candidates", "label": "Found Matches", "sortIndex": null, "order": null},
                "load_date": {"field": "loadDate", "label": "Load Date", "sortIndex": null, "order": null},
                "last_check_date": {
                    "field": "lastCheckDate",
                    "label": "Last Check Update",
                    "sortIndex": null,
                    "order": null
                },
                "firm_name": {"field": "firmName", "label": "Company", "sortIndex": null, "order": null},
                "agency_name": {"field": "agencyName", "label": "Client", "sortIndex": null, "order": null},
                "backdoor": {"field": "backdoor", "label": "Backdoor status", "sortIndex": null, "order": null}
            },
            requestParams: {
                requestSortParams: null,
                filterParams: null
            }

        }
    }

    updateTable() {
        var url = this.generateRequestsUrl();
        this.getTableData(url)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(this.state.queries, nextState.queries) || !_.isEqual(JSON.stringify(this.state.requestParams), JSON.stringify(nextState.requestParams))) || !_.isEqual(this.state.tableHeaders, nextState.tableHeaders)

    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state.requestParams, prevState.requestParams)) {
            this.updateTable()
        }
    }

    generateRequestsUrl() {
        var queryParams = $.extend({}, this.state.requestParams);
        var notNullParams = [];
        Object.keys(queryParams).map(function (key) {
            if (!_.isNull(queryParams[key])) {
                notNullParams.push(queryParams[key]["paramKey"] + "=" + queryParams[key]["paramValue"])
            }
        });

        var queriesUrl = (_.isNull(notNullParams)) ?
        QUERY + "/?pageSize=20" : QUERY + "/?pageSize=20&" + notNullParams.join("&");
        return queriesUrl
    }


    getTableData(queriesUrl) {
        var self = this;
        GET(queriesUrl, true).then(function (data) {
            self.setState({
                "queries": data['data'],
                "firstPage": data['firstPageUrl'],
                "previousPage": data['prevPageUrl'],
                "nextPage": data['nextPageUrl'],
                "lastPage": data['lastPageUrl'],
            })
        })
    }

    addQueryItem(item) {
        var self = this;
        var contentType = 'application/json; charset=utf-8';
        var jsonItem = JSON.stringify(item);
        POST(QUERY, jsonItem, contentType).then(function (data) {
            self.updateTable()
        });
    }

    onQueryDelete(id) {
        DELETE(QUERY + '/' + id);
        this.updateTable()

    }

    componentWillMount() {
        this.getTableData(QUERY + "/?pageSize=20")
    }

    updateSortOrder(id, order) {
        var header = $.extend({}, this.state.tableHeaders);
        var fieldsToSortBy = [];
        for (var item in header) {
            if (!_.isNull(header[item]["sortIndex"])) {
                fieldsToSortBy.push(item)
            }
        }
        if (!_.isEmpty(fieldsToSortBy)) {
            if (_.include(fieldsToSortBy, id)) {
                fieldsToSortBy.map(function (fieldId) {
                    if (header[fieldId]['sortIndex'] > header[id]['sortIndex']) {
                        header[fieldId]['sortIndex'] = header[fieldId]['sortIndex'] - 1
                    }
                });
                header[id]["order"] = order;
                header[id]["sortIndex"] = null;
                if (!_.isNull(order)) {
                    header[id]["sortIndex"] = 0;
                    var orders = fieldsToSortBy.map(function (fieldId) {
                        return header[fieldId]['sortIndex'];
                    });
                    var maxSortField = _.max(orders);
                    header[id]["sortIndex"] = maxSortField + 1
                } else header[id]["sortIndex"] = null
            } else {
                header[id]["order"] = order;
                if (!_.isNull(order)) {
                    var orders = fieldsToSortBy.map(function (fieldId) {
                        return header[fieldId]['sortIndex'];
                    });
                    var maxSortField = _.max(orders);
                    header[id]["sortIndex"] = maxSortField + 1
                } else header[id]["sortIndex"] = null
            }
        }
        else {
            header[id]["order"] = order;
            header[id]["sortIndex"] = (_.isNull(order)) ? null : 1

        }
        this.setState({"tableHeaders": header})
        this.onSortParamChanged(header)
    }

    onChangePage(pageStatus) {

        switch (pageStatus) {
            case "first":
                if (!_.isNull(this.state.firstPage)) {
                    this.getTableData(this.state.firstPage)
                }
                break;
            case "previous":
                if (!_.isNull(this.state.previousPage)) {
                    this.getTableData(this.state.previousPage)
                }
                break;
            case "next":
                if (!_.isNull(this.state.nextPage)) {
                    this.getTableData(this.state.nextPage)
                }
                break;
            case "last":
                if (!_.isNull(this.state.lastPage)) {
                    this.getTableData(this.state.lastPage)
                }
                break;

        }
    }

    onFilterChange(filter_value) {
        var requestParam = $.extend({}, this.state.requestParams);
        if (!_.isEqual(this.state.requestParams.filterParams, filter_value)) {
            requestParam["filterParams"] = (_.isEmpty(filter_value)) ?
                null : {"paramKey": "search", "paramValue": filter_value}
            this.setState({"requestParams": requestParam})
        }
    }

    onSortParamChanged(header) {
        var requestParam = $.extend({}, this.state.requestParams);
        var fieldsToSortBy = [];
        Object.keys(header).map(function (key) {
            if (!_.isNull(header[key]["sortIndex"])) {
                fieldsToSortBy.push({key: header[key]})
            }
        });

        if (!_.isEmpty(fieldsToSortBy)) {

            var sortedFieldsToSortBy = fieldsToSortBy.sort(function (a, b) {
                return a.key.sortIndex - b.key.sortIndex;
            });

            var sortParams = [];
            sortedFieldsToSortBy.map(function (field) {
                var order = (_.isEqual(field.key['order'], "desc")) ? "" : "-"
                sortParams.push(order + field.key["field"])
            });

            var sortParamsStr = sortParams.join(',')


            if (!_.isEqual(this.state.requestParams.requestSortParams, sortParamsStr)) {
                requestParam["requestSortParams"] = {"paramKey": "sortBy", "paramValue": sortParamsStr}
                this.setState({"requestParams": requestParam})
            }
        }
        else {
            if (!_.isNull(this.state.requestParams.requestSortParams)) {
                requestParam["requestSortParams"] = null;
                this.setState({"requestParams": requestParam})
            }
        }

    }

    onModal(id) {
        $('#' + id).modal('show');
    }

    render() {
        if (_.isNull(this.state.queries)) {
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
            <div id="queries">
                <Table id="candidates"
                       tableData={this.state.queries}
                       tableHeaders={this.state.tableHeaders}
                       updateSortOrder={(id, order)=>this.updateSortOrder(id, order)}
                       onChangePage={(page) => this.onChangePage(page)}
                       onQueryDelete={(id)=> this.onQueryDelete(id)}
                       onFilterChange={(filter)=>this.onFilterChange(filter)}
                />
                <ModalWindow
                    key="add-manually"
                    id="add-manually"
                    header="Add Candidate Manually"
                    content={
                        <AddCandidateQueryModal
                            id="add-manually"
                            func={(item)=>this.addQueryItem(item)}
                        />}

                />

                <ModalWindow
                    key="add-from-file"
                    id="add-from-file"
                    header="Add candidates from file"
                    content={<FileUpload
                        id="add-from-file"
                        updateTable={()=>this.updateTable()}
                    />}

                />
                <div className="external ui right fixed vertical menu">
                    <a className="item" onClick={this.onModal.bind(null, "add-from-file")}>

                        <div className="vertical-text">
                            <i className="green large plus icon"></i>
                            <i className="green large plus icon"></i>
                            Upload from file
                        </div>

                    </a>
                    <a className="item" onClick={this.onModal.bind(null, "add-manually")}>
                        <i className="green big add user icon"></i>

                        <div className="vertical-text">

                            Add manually
                        </div>

                    </a>
                    <a className="item">
                        <i className="green big file excel outline icon"></i>
                        <div className="vertical-text">
                            Export to excel
                        </div>
                    </a>
                </div>
            </div>
        )
    }
}