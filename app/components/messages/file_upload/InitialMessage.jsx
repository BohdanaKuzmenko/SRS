import {Component} from 'react'
export default class InitialMessage extends Component{
    render(){
        return (
            <div className="ui mini message">
                <div className="content">
                    <div className="header">
                        <i className="small plus icon"/>
                        Upload new file
                    </div>
                </div>
            </div>
        )
    }
}