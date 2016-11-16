import React, {PropTypes} from 'react'
import {DELETE, GET} from 'http/HTTP.jsx'
import {QUERY} from 'urls/Urls.jsx'
import UUID from 'uuid-js'
import moment from 'moment'
import jsxToString from 'jsx-to-string'

export default class QueriesTbody extends React.Component {

    // interval: 1;

    constructor(props) {
        super(props);
        this.state = {
            checkedSources: null,
            queriesToDelete: []

        }
    }

    generateId() {
        var uuid4 = UUID.create();
        return uuid4.toString();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(this.props.tableData, nextProps.tableData)) ||
            (!_.isEqual(this.state.checkedSources, nextState.checkedSources)) ||
            (!_.isEqual(this.state.queriesToDelete, nextState.queriesToDelete))
    }

    onRowRemove(id) {
        this.props.onQueryDelete(id)
    }

    addQueriesToDelete(id) {
        var selectedText = document.getSelection().toString();
        if (_.isEmpty(selectedText)){
            var idsToDelete = this.state.queriesToDelete.slice();
            if (_.contains(idsToDelete, id)){
                idsToDelete = _.without(idsToDelete, id)
            }else {
                idsToDelete.push(id);
            }
            this.setState({"queriesToDelete":idsToDelete})
        }
    }

    generateTooltip(uncheckedSources, cellId) {
        var sources = uncheckedSources.map(function (source) {
            return <li key={cellId + source}>{source}</li>
        });
        return (<div class="tooltip left aligned"><h5>Unchecked sources:</h5>
            <ul>{sources}</ul>
        </div>)
    }

    getLastUpdateDate(query, index, row_index) {
        var self = this;

        var cellId = index + row_index;
        if (!_.isUndefined(this.state.checkedSources[query["id"]])) {
            var lastCheckUpdate = this.state.checkedSources[query["id"]];
            if (_.isNull(lastCheckUpdate["lastCheckDate"])) {
                return <td key={self.generateId()} id={cellId}>Has not been checked yet</td>
            } else {
                var tooltip = (_.isEmpty(lastCheckUpdate["uncheckedSources"])) ?
                    null :
                    (
                        <div className="data-tooltip left aligned"
                             data-html={jsxToString(self.generateTooltip(lastCheckUpdate['uncheckedSources'], cellId))}
                             data-variation="basic">
                            <div className="arrow-right-1"/>
                        </div>
                    );
                return <td key={self.generateId()} id={cellId}>
                    {tooltip}
                    {lastCheckUpdate["lastCheckDate"]}
                </td>
            }
        }
        return <td>null</td>
    }


    generateBody(data, header) {
        var self = this;
        return data.map(function (query, index) {
            var row = [];
            var id = query["id"];
            row.push(
                <td key={self.generateId()}
                    onClick={self.props.onQueryRecheck.bind(self, id)}>
                    <i className="large green repeat icon"/>
                </td>
            );
            Object.keys(header).map(function (columnName, row_index) {
                var className = "";
                if (_.isBoolean(query[columnName])) {
                    className = query[columnName] ? "positive" : "negative";
                    query[columnName] = query[columnName] ? "Yes" : "No"
                }
                switch (columnName) {
                    case "load_date":
                        row.push(
                            <td className={className}
                                key={self.generateId()}
                                id={index + row_index}>
                                {new Date(query[columnName]).toLocaleString()}
                            </td>
                        );
                        break;

                    case "last_check_date":
                        row.push(self.getLastUpdateDate(query, index, row_index));
                        break;

                    case "firm_name":
                        var url = query["url"].startsWith("http") ? query["url"] : "http://" + query["url"]
                        row.push(
                            <td key={self.generateId()}
                                id={index + row_index}>
                                <a target="_blank" href={url} onClick={function (e) {
                                    e.stopPropagation();
                                }}>{query[columnName]}</a>
                            </td>
                        );
                        break;

                    default:
                        row.push(
                            <td className={className}
                                key={self.generateId()}
                                id={index + row_index}>{query[columnName]}
                            </td>
                        )
                }
            });
            // row.push(
            //     <td key={self.generateId()}><i className="remove large blue user icon"/>
            //         <div className="ui custom popup hidden">
            //             <div className="ui center aligned grid">
            //                 <div>Do you really want to delete query?</div>
            //                 <div className="ui row">
            //                     <button className="ui positive button"
            //                             onClick={self.props.onQueryDelete.bind(self, id)}>Yes
            //                     </button>
            //                     <button className="ui negative button" onClick={self.hidePopup.bind(self)}> No</button>
            //                 </div>
            //             </div>
            //         </div>
            //     </td>
            // );
            var rowClass = self.state.queriesToDelete.includes(id) ? "negative" : "";

            return (
                <tr className={rowClass}
                    onMouseUp={self.addQueriesToDelete.bind(self, id)}
                    key={self.generateId()}
                    id={index}>
                    {row}
                </tr>
            )
        });
    }

    hidePopup() {
        $('.custom.popup').popup('hide all');

    }

    initializePopups() {
        $('.remove.large.blue.user.icon')
            .popup({
                popup: $('.custom.popup'),
                position: 'left center',
                on: 'click',
                inline: true
            });

        $(".data-tooltip").popup({
            hoverable: true,
            inline: true,
            on: 'hover',
        });
    }

    getCheckedSouces(queries) {
        var queriesUpdates = {};
        var lastUpdateColumns = this.props.lastUpdateDateHeaders;
        queries.map(function (query) {
            var checkedSourcesDates = [];
            var uncheckedSources = [];

            Object.keys(lastUpdateColumns).map(function (source) {
                if (!_.isNull(query[source])) {
                    checkedSourcesDates.push(moment(query[source]))
                }
                else {
                    uncheckedSources.push(lastUpdateColumns[source])
                }
            });
            queriesUpdates[query["id"]] = {};
            queriesUpdates[query["id"]]["lastCheckDate"] = _.isEmpty(checkedSourcesDates) ?
                null :
                new Date(_.max(checkedSourcesDates)._i).toLocaleString();
            queriesUpdates[query["id"]]["uncheckedSources"] = uncheckedSources;
        });
        this.setState({"checkedSources": queriesUpdates})

    }

    // updateNotCheckedResources() {
    //     var self = this;
    //     GET(this.props.currentPageUrl).then(function (data) {
    //         self.getCheckedSouces(data)
    //     })
    // }

    // componentWillUnmount(){
    //      clearInterval(this.interval)
    // }

    componentWillMount() {
        this.getCheckedSouces(this.props.tableData)
    }

    componentDidUpdate() {
        this.initializePopups()
    }

    componentDidMount() {
        // this.interval = setInterval(this.updateNotCheckedResources.bind(this), 1000)
        this.initializePopups()
    }

    render() {
        var body = this.generateBody(this.props.tableData, this.props.tableHeader);
        return (
            <tbody>{body}</tbody>
        )
    }

}
QueriesTbody.propTypes = {
    tableData: PropTypes.array.isRequired,
    tableHeader: PropTypes.object.isRequired,
    lastUpdateDateHeaders: PropTypes.object.isRequired,
    onQueryDelete: PropTypes.func.isRequired,
    onQueryRecheck: PropTypes.func.isRequired,
};