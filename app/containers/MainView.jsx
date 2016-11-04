import React, {PropTypes} from 'react'
import Menu from 'components/menu/Menu.jsx'
import Candidates from 'containers/menuTabs/Candidates.jsx'
import PossibleMatches from 'containers/menuTabs/PossibleMatches.jsx'
import Settings from 'containers/menuTabs/Settings.jsx'
import Header from "components/header/Header.jsx"

export default class MainView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabs: {
                candidates: <Candidates/>,
                matches: <PossibleMatches/>,
                settings: <Settings userName={this.props.userName}/>
            },
            activeTab: "candidates"
        }
    }

    onChangeTab(id) {
        if (!_.isEqual(this.state.activeTab, id)) {
            this.setState({"activeTab": id})
        }
    }


    render() {

        return (
            <div className="main view">
                <Header/>
                <Menu chooseMenu={(activeId)=>this.onChangeTab(activeId)}/>
                <div className="content">
                    {this.state.tabs[this.state.activeTab]}
                </div>
            </div>

        )
    }
}
MainView.propTypes = {
    userName: PropTypes.string.isRequired
};
