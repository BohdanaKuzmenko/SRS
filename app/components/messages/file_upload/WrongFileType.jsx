import {Component} from 'react'
export default class WrongFileType extends Component{
    render(){
        return (
            <div className="ui mini negative message">
                <div className="content">
                    <div className="header">
                        Wrong type of file. Try another one.
                    </div>
                </div>
            </div>
        )
    }
}