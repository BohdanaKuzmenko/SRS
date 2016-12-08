import React from 'react'
import Table from 'components/table/queries/QueriesTable.jsx'
import {GET, POST, DELETE} from 'http/HTTP.jsx'
import {QUERY, EXPORT} from 'urls/Urls.jsx'
import ModalWindow from 'components/modal/ModalWindow.jsx'
import AddCandidateQueryModal from 'components/modal/content/AddCandidateQueryModal.jsx'
import FileUpload from 'components/modal/content/FileUpload.jsx'


export default class Queries extends React.Component {
    constructor(props) {
        var pageSize = 15;
        super(props);
        this.state = {
            currentPage: null,
            queries: null,
            firstPage: null,
            previousPage: null,
            nextPage: null,
            lastPage: null,
            pageSize: pageSize,
            requestParams: {
                requestSortParams: null,
                filterParams: null
            },
            tableHeaders: {
                first_name: {field: "firstName", label: "First Name", sortIndex: null, order: null},
                last_name: {field: "lastName", label: "Last Name", sortIndex: null, order: null},
                middle_name: {field: "middleName", label: "Middle Name", sortIndex: null, order: null},
                matches_found: {field: "candidates", label: "Found Matches", sortIndex: null, order: null},
                load_date: {field: "loadDate", label: "Load Date", sortIndex: null, order: null},
                last_check_date: {field: "lastCheckDate", label: "Last Check Update", sortIndex: null, order: null},
                firm_name: {field: "firmName", label: "Hiring Company", sortIndex: null, order: null},
                agency_name: {field: "agencyName", label: "Our Client", sortIndex: null, order: null},
                backdoor: {field: "backdoor", label: "Backdoor status", sortIndex: null, order: null}
            },

            lastUpdateDateHeaders: {
                custom_site_check_date: "Company Site",
                facebook_check_date: "Facebook",
                linkedin_check_date: "LinkedIn",
                email_check_date: "Email"
            },
            queriesToDelete: [],

            currentPageUrl: QUERY + "/?pageSize=" + pageSize

        }
    }

    updateTable() {
        var url = this.generateRequestsUrl();
        this.getTableData(url)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(this.state.queries, nextState.queries) || !_.isEqual(JSON.stringify(this.state.requestParams), JSON.stringify(nextState.requestParams))) || !_.isEqual(this.state.tableHeaders, nextState.tableHeaders) || !_.isEqual(this.state.queriesToDelete, nextState.queriesToDelete)

    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state.requestParams, prevState.requestParams)) {
            this.updateTable()
        }
    }

    getParamsString() {
        var queryParams = $.extend({}, this.state.requestParams);
        var notNullParams = [];
        Object.keys(queryParams).map(function (key) {
            if (!_.isNull(queryParams[key])) {
                notNullParams.push(queryParams[key]["paramKey"] + "=" + queryParams[key]["paramValue"])
            }
        });
        return notNullParams.join("&")
    }

    generateRequestsUrl() {
        var requestParams = this.getParamsString();
        var url = (_.isEmpty(requestParams)) ?
        QUERY + "/?pageSize=" + this.state.pageSize :
        QUERY + "/?pageSize=" + this.state.pageSize + "&" + requestParams;
        this.setState({"currentPageUrl": url})
        return url;

    }

    generateExportUrl() {
        var requestParams = this.getParamsString();
        var exportIds = "id=" + this.state.queriesToDelete.join(',');
        return (_.isEmpty(requestParams) && _.isEmpty(exportIds)) ?
            EXPORT : EXPORT + "/?" + [requestParams, exportIds].join("&");
    }


    getTableData(queriesUrl) {
        var self = this;
        GET(queriesUrl, true).then(function (data) {
            self.setState({
                "queries": data['data'],
                "currentPage": parseInt(data['currentPage']) + 1,
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
        POST(QUERY, jsonItem, contentType).then(function () {
            self.updateTable()
        });
    }

    addIdToDelete(id) {
        var idsToDelete = this.state.queriesToDelete.slice();
        if (_.contains(idsToDelete, id)) {
            idsToDelete = _.without(idsToDelete, id)
        } else {
            idsToDelete.push(id);
        }
        this.setState({"queriesToDelete": idsToDelete})
    }

    onQueryDelete() {
        if (!_.isEmpty(this.state.queriesToDelete)) {
            var idsToDelete = this.state.queriesToDelete.join(',');
            DELETE(QUERY + '/' + idsToDelete);
            this.setState({"queriesToDelete": []});
            this.updateTable()
        }
    }

    onQueryRecheck(id) {
        POST([QUERY, id, 'recheck'].join('/'))
    }

    componentWillMount() {
        this.getTableData(this.state.currentPageUrl)
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
        this.setState({"tableHeaders": header});
        this.onSortParamChanged(header)
    }

    onChangePage(pageStatus) {

        switch (pageStatus) {
            case "first":
                if (!_.isNull(this.state.firstPage)) {
                    this.setState({"currentPageUrl": this.state.firstPage});
                    this.getTableData(this.state.firstPage)
                }
                break;
            case "previous":
                if (!_.isNull(this.state.previousPage)) {
                    this.setState({"currentPageUrl": this.state.previousPage});
                    this.getTableData(this.state.previousPage)
                }
                break;
            case "next":
                if (!_.isNull(this.state.nextPage)) {
                    this.setState({"currentPageUrl": this.state.nextPage});
                    this.getTableData(this.state.nextPage)
                }
                break;
            case "last":
                if (!_.isNull(this.state.lastPage)) {
                    this.setState({"currentPageUrl": this.state.lastPage});
                    this.getTableData(this.state.lastPage)
                }
                break;

        }
    }

    onFilterChange(filter_value) {
        var requestParam = $.extend({}, this.state.requestParams);
        if (!_.isEqual(this.state.requestParams.filterParams, filter_value)) {
            requestParam["filterParams"] = (_.isEmpty(filter_value)) ?
                null : {"paramKey": "search", "paramValue": filter_value};
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
                var order = (_.isEqual(field.key['order'], "desc")) ? "" : "-";
                sortParams.push(order + field.key["field"])
            });

            var sortParamsStr = sortParams.join(',');

            if (!_.isEqual(this.state.requestParams.requestSortParams, sortParamsStr)) {
                requestParam["requestSortParams"] = {"paramKey": "sortBy", "paramValue": sortParamsStr};
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
                       lastUpdateDateHeaders={this.state.lastUpdateDateHeaders}
                       currentPage={this.state.currentPage}
                       updateSortOrder={(id, order)=>this.updateSortOrder(id, order)}
                       onChangePage={(page) => this.onChangePage(page)}
                       onQueryDelete={(id)=> this.onQueryDelete(id)}
                       onQueryRecheck={(id)=> this.onQueryRecheck(id)}
                       onFilterChange={(filter)=>this.onFilterChange(filter)}
                       currentPageUrl={this.state.currentPageUrl}
                       onModal={(id)=>this.onModal(id)}
                       exportUrl={this.generateExportUrl()}
                       queriesToDelete={this.state.queriesToDelete}
                       addIdToDelete={(id)=> this.addIdToDelete(id)}
                       deleteQueries={()=>this.onQueryDelete()}
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

            </div>
        )
    }
}