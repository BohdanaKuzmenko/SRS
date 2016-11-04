import React from 'react'
import Dropzone from 'react-dropzone';
import {FILE_UPLOAD} from 'urls/Urls.jsx'

export default class FileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            agency: null,
        }
    }

    onDrop(acceptedFile) {
        this.setState({
            "file": acceptedFile[0]
        });
        $('.drug-and-drop>div').css(
            {
                background: "#FCFFF5",
                boxShadow: " 0 0 0 1px #A3C293 inset,0 0 0 0 transparent",
                border: "2px rgb(26, 83, 27)",
                color: "#1A531B"

            }
        );

    }


    onOpenClick() {
        var self = this;
        if (!_.isNull(this.state.file)) {
            var fd = new FormData();
            fd.append('file', this.state.file);

            $('#' + self.props.id).modal('toggle')

            $('.drug-and-drop>div').css({
                    width: "200px",
                    height: "200px",
                    border: "2px dashed rgb(102, 102, 102)",
                    boxShadow: "none",
                    borderRadius: "5px",
                    background: "#edeef0"
                }
            )

            $.ajax({
                url: FILE_UPLOAD,
                data: fd,
                processData: false,
                contentType: false,
                type: 'POST',


            }).then(function () {
                self.setState({
                    file: null,
                    agency: null,
                });
                self.props.updateTable();

            })
        }



    }

    render() {
        var title_status = (_.isNull(this.state.file)) ?
            <div className="ui mini message">
                <div className="content">
                    <div className="header">
                        <i className="small plus icon"></i>
                        Upload new file
                    </div>
                </div>
            </div> :
            <div className="file-upload-message">
                <div className="header">
                    You have chosen file: {this.state.file.name}
                </div>
                <p>Click button below to upload</p>
            </div>

        return (
            <div className="ui center aligned grid">
                <div className="ui row">
                    <div className="center aligned column">
                        <div className="drug-and-drop">
                            <Dropzone ref={(node) => {
                                this.dropzone = node;
                            }} onDrop={this.onDrop.bind(this)}>
                                {title_status}
                            </Dropzone>
                        </div>
                    </div>
                </div>
                <div className="ui row">
                    <div className="center aligned column">
                        <button id="upload-file" className="ui vk button fluid button" type="button"
                                onClick={this.onOpenClick.bind(this)}>
                            Send File
                        </button>
                    </div>

                </div>

            </div>
        );
    }
}

