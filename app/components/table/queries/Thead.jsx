import Reat, {PropTypes} from 'react'

export default class Thead extends Reat.Component {

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
        var header_items = Object.keys(header).map(function (key) {
            var sortIndex = _.isNull(header[key]["sortIndex"]) ? "" : "[" + header[key]["sortIndex"] + "]";
            return (
                <th key={key} id={key} onClick={self.onSortChange.bind(null, self, {key})}>{header[key]["label"]}
                    <i className="sort icon"/>
                    {sortIndex}
                </th>
            )
        })
        header_items.push(<th key={"empty"}></th>)
        return <tr>{header_items}</tr>
    }

    render() {
        var header = this.generateHeader(this.props.tableHeaders);
        return (
            <thead>{header}</thead>
        )
    }

}
Thead.propTypes = {
    tableHeaders: PropTypes.object.isRequired,
    updateSortOrder: PropTypes.func.isRequired
};