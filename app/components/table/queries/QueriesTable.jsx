import {Component, PropTypes} from 'react'
import Thead from 'components/table/queries/QueriesThead.jsx'
import Tbody from 'components/table/queries/QueriesTbody.jsx'
import Tfoot from 'components/table/queries/QueriesTfoot.jsx'
import InputField from 'components/InputField.jsx'
export default class QueriesTable extends Component {

    onChange(event) {
        this.props.onFilterChange(event.target.value)
    }

    render() {
        return (
            <div>
                <div className="column">
                    <div className="ui grid">
                        <div className="two column row">
                            <div className="sixteen wide column">
                                <div className="ui inline fluid input field controls">
                                    <InputField
                                        inputType="text"
                                        placeholder="Input word(s) you want to filter table by..."
                                        onChange={(event)=>this.onChange(event)}/>

                                    <a className="ui red icon button"
                                       data-tooltip="Remove candidate(s)"
                                       data-position="left center"
                                       onClick={this.props.onQueryDelete}>
                                        <i className="remove user icon"/>

                                    </a>
                                    <a className="ui green icon button"
                                       data-tooltip="Add candidate manually"
                                       data-position="left center"
                                       onClick={this.props.onModal.bind(this, 'add-manually')}>
                                        <i className="add user icon"/>
                                    </a>
                                    <a className="ui green icon button"
                                       data-tooltip="Add candidate from file"
                                       data-position="left center"
                                       onClick={this.props.onModal.bind(this, 'add-from-file')}>
                                        <i className="file icon"/>
                                    </a>
                                    <a href={this.props.exportUrl}
                                       data-tooltip="Export to CSV"
                                       data-position="left center"
                                       className="ui blue icon button">
                                        <i className="save icon"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="ui center aligned striped celled  selectable table">
                    <Thead
                        tableHeaders={this.props.tableHeaders}
                        updateSortOrder={(id, order)=>this.props.updateSortOrder(id, order)}
                    />
                    <Tbody
                        tableData={this.props.tableData}
                        tableHeader={this.props.tableHeaders}
                        lastUpdateDateHeaders={this.props.lastUpdateDateHeaders}
                        onQueryDelete={(id)=>this.props.onQueryDelete(id)}
                        onQueryRecheck={(id)=>this.props.onQueryRecheck(id)}
                        currentPageUrl={this.props.currentPageUrl}
                        queriesToDelete={this.props.queriesToDelete}
                        addIdToDelete={this.props.addIdToDelete}
                    />
                    <Tfoot
                        onChangePage={(page)=>this.props.onChangePage(page)}
                        currentPage={this.props.currentPage}
                    />
                </table>
            </div>
        )
    }
}
QueriesTable.propTypes = {
    tableData: PropTypes.array.isRequired,
    tableHeaders: PropTypes.object.isRequired,
    lastUpdateDateHeaders: PropTypes.object.isRequired,
    updateSortOrder: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onQueryDelete: PropTypes.func.isRequired,
    onQueryRecheck: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    currentPageUrl: PropTypes.string.isRequired,
    onModal: PropTypes.func.isRequired,
    exportUrl: PropTypes.string.isRequired,
    queriesToDelete:PropTypes.array.isRequired,
    addIdToDelete:PropTypes.func.isRequired
};