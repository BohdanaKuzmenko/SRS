import React from 'react'
import {render} from 'react-dom'
import {POST} from 'http/HTTP.jsx'
import {START_SESSION} from 'urls/Urls.jsx'


export default class Header extends React.Component {
    logOff(){
        var contentType = 'application/x-www-form-urlencoded; charset=utf-8';
        POST(START_SESSION, {username:""}, contentType).then(function (data) {
            console.log()
        })

    }
    render() {
        return <div id="header">
            <div className="header-text">

            </div>
        </div>
    }
}