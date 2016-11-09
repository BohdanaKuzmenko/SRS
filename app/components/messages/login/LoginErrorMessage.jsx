import {Component} from 'react'

export default class LoginErrorMessage extends Component{
    render(){
        return (
            <div className="ui negative message">
                <div className="header">
                    Unable to log in.
                </div>
                <p>Please check that you have entered your login and password correctly.</p>
                <ul>
                    <li>Is the Caps Lock safely turned off?</li>
                    <li>Maybe you are using the wrong input language? (e.g. German vs. English)</li>
                    <li>Try typing your password in a text editor and pasting it into the "Password" field.</li>

                </ul>
            </div>
        )
    }
}