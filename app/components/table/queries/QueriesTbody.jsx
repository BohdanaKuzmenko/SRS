import React, {PropTypes} from 'react'
import {DELETE} from 'http/HTTP.jsx'
import {QUERY} from 'urls/Urls.jsx'
import UUID from 'uuid-js'
import moment from 'moment'
import jsxToString from 'jsx-to-string'

export default class QueriesTbody extends React.Component {


    generateId() {
        var uuid4 = UUID.create();
        return uuid4.toString();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(this.props.tableData, nextProps.tableData))
    }

    onRowRemove(id) {
        this.props.onQueryDelete(id)
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
            var row = Object.keys(header).map(function (columnName, row_index) {
                var className = "";
                if (_.isBoolean(query[columnName])) {
                    className = query[columnName] ? "positive" : "negative";
                    query[columnName] = query[columnName] ? "Yes" : "No"
                }
                switch (columnName) {
                    case "load_date":
                        return (
                            <td className={className}
                                key={self.generateId()}
                                id={index + row_index}>
                                {new Date(query[columnName]).toLocaleString()}
                            </td>
                        );
                        break;

                    case "last_check_date":
                        return self.getLastUpdateDate(query, index, row_index);
                        break;

                    default:
                        return (
                            <td className={className}
                                key={self.generateId()}
                                id={index + row_index}>{query[columnName]}
                            </td>
                        )
                }

            });

            var id = query["id"];
            row.push(
                <td key={self.generateId()}><i className="remove large blue user icon"/>
                    <div className="ui custom popup hidden">
                        <div className="ui center aligned grid">
                            <div>Do you really want to delete query?</div>
                            <div className="ui row">
                                <button className="ui positive button"
                                        onClick={self.props.onQueryDelete.bind(self, id)}>Yes
                                </button>
                                <button className="ui negative button" onClick={self.hidePopup.bind(self)}> No</button>
                            </div>
                        </div>
                    </div>
                </td>
            );
            return <tr key={self.generateId()} id={index}>{row}</tr>
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
    onQueryDelete: PropTypes.func.isRequired
};