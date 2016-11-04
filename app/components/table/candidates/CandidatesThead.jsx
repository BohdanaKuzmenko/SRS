import Reat, {PropTypes} from 'react'

export default class CandidatesThead extends Reat.Component {



    generateHeader(header) {
        var self = this;
        var header_items = [];
        header_items.push(<th key={"empty"}>Initial candidate</th>);
        Object.keys(header).map(function (key) {
            var colClass = (!_.isEqual(key, "status"))? "":"one wide"
            header_items.push(<th key={key} className={colClass} id={key}>{header[key]["label"]}</th>)
        });

        return <tr>{header_items}</tr>
    }

    render() {
        var header = this.generateHeader(this.props.tableHeaders);
        return (
            <thead>{header}</thead>
        )
    }

}
CandidatesThead.propTypes = {
    tableHeaders: PropTypes.object.isRequired,
};