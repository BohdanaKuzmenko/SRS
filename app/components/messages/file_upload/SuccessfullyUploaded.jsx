import {Component, PropTypes} from 'react'
export default class SuccessfullyUploaded extends Component{
    render(){
        return (
            <div className="file-upload-message">
                <div className="header">
                    You have chosen file: {this.props.file_name}
                </div>
                <p>Click button below to upload</p>
            </div>
        )
    }
}
SuccessfullyUploaded.propTypes={
    file_name: PropTypes.string.isRequired
};