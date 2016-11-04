import Reat, {PropTypes} from 'react'
import {DELETE} from 'http/HTTP.jsx'
import {QUERY} from 'urls/Urls.jsx'
import UUID from 'uuid-js'
import moment from 'moment'
export default class Tbody extends Reat.Component {


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

    generateBody(data, header) {
        var self = this
        var lastUpdateColumns = {"custom_site_check_date":"Company Site", "facebook_check_date":"Facebook",
            "linkedin_check_date":"LinkedIn", "email_check_date":"Email"}
        var tbody = data.map(function (query, index) {
            var row = Object.keys(header).map(function (columnName, row_index) {
                var className = "";
                if (_.isBoolean(query[columnName])) {
                    className = query[columnName] ? "positive" : "negative";
                    query[columnName] = query[columnName] ? "Yes" : "No"
                }
                if (row_index == 5) {
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

                    var lastCheck = _.isEmpty(checkedSourcesDates) ?
                        "Has not been checked yet" :
                        _.max(checkedSourcesDates)._i

                    var tooltipText = [uncheckedSources.join(','),
                        (uncheckedSources.length>1)? "have":"has",
                        "not been checked yet"].join(' ')
                    var note = (_.isEmpty(uncheckedSources) || _.isEmpty(checkedSourcesDates)) ?
                        "" : (
                        <div className="arrow-right-1">
                            <div  className="data-tooltip"
                                  data-tooltip={tooltipText}></div>
                        </div>
                    );

                    return (
                        <td key={self.generateId()} id={index + row_index}>
                            {note}
                            {lastCheck}

                        </td>
                    )

                }
                return <td className={className} key={self.generateId()} id={index + row_index}>{query[columnName]}</td>
            });
            var id = query["id"];
            row.push(
                <td
                    id={id}
                    key={self.generateId()}
                    className="collapsing"
                    onClick={self.onRowRemove.bind(self, id)}>
                    <i className="remove large blue user icon"></i>
                </td>
            );
            return <tr key={self.generateId()} id={index}>{row}</tr>
        });
        return tbody
    }

    render() {
        var body = this.generateBody(this.props.tableData, this.props.tableHeader);
        return (
            <tbody>{body}</tbody>
        )
    }

}
Tbody.propTypes = {
    tableData: PropTypes.array.isRequired,
    tableHeader: PropTypes.object.isRequired
};