import React, {PropTypes} from 'react'
import {DELETE, GET} from 'http/HTTP.jsx'
import {QUERY} from 'urls/Urls.jsx'
import UUID from 'uuid-js'
import moment from 'moment'
import jsxToString from 'jsx-to-string'

export default class QueriesTbody extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedSources: null,
        }
    }

    generateId() {
        var uuid4 = UUID.create();
        return uuid4.toString();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(this.props.tableData, nextProps.tableData)) ||
            (!_.isEqual(this.state.checkedSources, nextState.checkedSources)) ||
            (!_.isEqual(this.props.queriesToDelete, nextProps.queriesToDelete))
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
        var lastUpdateColumns = this.props.lastUpdateDateHeaders;
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

        var cellId = index + row_index;
        if (_.isEmpty(checkedSourcesDates)) {
            return <td key={self.generateId()} id={cellId}>Has not been checked yet</td>
        }
        else {
            var lastCheckDate = new Date(_.max(checkedSourcesDates)._i).toLocaleString();
            var tooltip = (_.isEmpty(uncheckedSources)) ?
                null :
                (
                    <div className="data-tooltip left aligned"
                         data-html={jsxToString(self.generateTooltip(uncheckedSources, cellId))}
                         data-variation="basic">
                        <div className="arrow-right-1"/>
                    </div>
                );
            return <td key={self.generateId()} id={cellId}>
                {tooltip}
                {lastCheckDate}
            </td>
        }
    }


    generateBody(data, header) {
        var self = this;
        return data.map(function (query, index) {
            var row = [];
            var id = query["id"];
            row.push(
                <td key={self.generateId()}>
                    <button className="ui white tiny circular basic icon button"
                            onClick={self.props.onQueryRecheck.bind(self, id)}>
                        <i className="large green repeat icon"/>
                    </button>

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
            var checked = self.props.queriesToDelete.includes(id) ? "checked" : "";
            row.push(
                <td key={self.generateId()}>
                    <div className="ui checkbox">
                        <input type="checkbox"
                               onClick={self.props.addIdToDelete.bind(self, id)}
                               defaultChecked={checked}/>
                        <label></label>
                    </div>
                </td>
            );
            var rowClass = self.props.queriesToDelete.includes(id) ? "warning" : "";
            return (
                <tr className={rowClass}
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
        $(".data-tooltip").popup({
            hoverable: true,
            inline: true,
            on: 'hover',
        });
    }

    componentDidUpdate() {
        this.initializePopups()
    }

    componentDidMount() {
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
    queriesToDelete: PropTypes.array.isRequired,
    addIdToDelete: PropTypes.func.isRequired,
};