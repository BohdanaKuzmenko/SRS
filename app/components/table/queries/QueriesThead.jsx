import {Component, PropTypes} from 'react'

export default class QueriesThead extends Component {

    onSortChange(self, id) {
        var icon = $("#" + id['key'] + " > i");
        var itemClass = icon.attr("class");
        var sortOrder;
        switch (itemClass) {
            case "sort icon":
                icon.removeClass("icon")
                    .addClass("descending icon");
                sortOrder = "desc";
                break;
            case "sort descending icon":
                icon.removeClass("descending icon")
                    .addClass("ascending icon");
                sortOrder = "asc";
                break;
            case "sort ascending icon":
                icon.removeClass("ascending");
                sortOrder = null;
                break;
        }
        self.props.updateSortOrder(id['key'], sortOrder);
    }

    generateHeader(header) {
        var self = this;
        var header_items = [];
        header_items.push(<th key={"recheck_candidate"}></th>);
        Object.keys(header).map(function (key) {
            var sortIndex = _.isNull(header[key]["sortIndex"]) ? "" : "[" + header[key]["sortIndex"] + "]";
            header_items.push(
                <th key={key} id={key} onClick={self.onSortChange.bind(null, self, {key})}>
                    {header[key]["label"]}
                    <i className="sort icon"/>
                    {sortIndex}
                </th>
            )
        });
        header_items.push(<th key={"delete_candidate"}></th>);
        return <tr>{header_items}</tr>
    }

    render() {
        var header = this.generateHeader(this.props.tableHeaders);
        return (
            <thead>{header}</thead>
        )
    }

}
QueriesThead.propTypes = {
    tableHeaders: PropTypes.object.isRequired,
    updateSortOrder: PropTypes.func.isRequired
};