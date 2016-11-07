import Reat, {PropTypes} from 'react'
import Thead from 'components/table/queries/QueriesThead.jsx'
import Tbody from 'components/table/queries/QueriesTbody.jsx'
import Tfoot from 'components/table/queries/QueriesTfoot.jsx'
import InputField from 'components/InputField.jsx'
export default class QueriesTable extends Reat.Component {

    checkEnterButton(component, event){
        if (event.keyCode == 13) {
            component.props.onFilterChange(event.target.value)
        }
    }

    render() {
        return (
            <div>
                <div className="column">
                    <div className="ui inline fluid input field">
                        <input type="text"
                               className="ui fluid input"
                               placeholder="Input word(s) you want to filter table by..."
                               onKeyDown={this.checkEnterButton.bind(null, this)}
                        />
                    </div>
                </div>


                <table className="ui center aligned striped celled  selectable right-definition unstackable table">
                    <Thead
                        tableHeaders={this.props.tableHeaders}
                        updateSortOrder={(id, order)=>this.props.updateSortOrder(id, order)}
                    />
                    <Tbody
                        tableData={this.props.tableData}
                        tableHeader={this.props.tableHeaders}
                        onQueryDelete={(id)=>this.props.onQueryDelete(id)}
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
    updateSortOrder: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onQueryDelete: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired

};