import React from 'react'
import {render} from 'react-dom'
import {GET} from 'http/HTTP.jsx'
import {CLOSE_SESSION} from 'urls/Urls.jsx'


export default class Header extends React.Component {

    logOff(){
        GET(CLOSE_SESSION).then(function (data) {
            if(_.isEqual(JSON.parse(data)["status"], "OK")){
                location.reload();
            }

        })

    }
    render() {
        return <div id="header">
            <div className="header-text">
              <button id="log-out" className="ui big vk circular icon button" onClick={this.logOff.bind(this)}>
                    <i className="sign out icon"></i>
                </button>
            </div>
        </div>
    }
}