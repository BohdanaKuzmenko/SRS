import {Component, PropTypes} from 'react'

export default class QueriesTfoot extends Component {

    onPageChange(page){
        this.props.onChangePage(page)
    }

    render() {
        return (
            <tfoot>
            <tr>
                <th colSpan="11">
                    <div className="ui right floated pagination menu">
                        <a className="icon item" onClick={this.onPageChange.bind(this, "first")}>
                            <i className="angle double left icon"/>
                        </a>
                        <a className="item" onClick={this.onPageChange.bind(this, "previous")}>
                            <i className="angle left icon"/>
                        </a>
                        <a className="item">{this.props.currentPage}</a>
                        <a className="item" onClick={this.onPageChange.bind(this,"next")}>
                            <i className="angle right icon"/>
                        </a>
                        <a className="item" onClick={this.onPageChange.bind(this,"last")}>
                            <i className="angle double right icon"/>
                        </a>

                    </div>
                </th>
            </tr>
            </tfoot>
        )
    }

}
