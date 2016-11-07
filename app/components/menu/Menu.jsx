import React, {PropTypes} from "react"

export default class Menu extends React.Component{
    constructor(props){
        super(props)
    }

    onTabChange(item) {
        $(".item").removeClass("active");
        $(item.target).addClass("active");
        var {chooseMenu} = this.props;
        chooseMenu($(item.target).attr("id"))
    }

    render(){
        return (
            <div id="main-menu" className="ui left fixed vertical menu">
                <a id="queries"
                   className="item active"
                   onClick={this.onTabChange.bind(this)}>
                    Candidates</a>
                <a id="candidates"
                   className="item"
                   onClick={this.onTabChange.bind(this)}>
                    Possible matches
                </a>
                <a id="settings"
                   className="item"
                   onClick={this.onTabChange.bind(this)}>Settings</a>
            </div>
        )
    }
}
Menu.propTypes = {
    chooseMenu: PropTypes.func.isRequired
}