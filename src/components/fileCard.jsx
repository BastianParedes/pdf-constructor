import React from 'react';

class FileCard extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            key: props.key,
            file: props.file,
            imageRotation: props.imageRotation,
            pageSize: props.pageSize,
            pageOrientation: props.pageOrientation,
            base64: '',
            updateBase64: props.updateBase64
        };
        console.log(this.state.pageSize);
    }
    componentDidMount() {
        if (this.state.base64 === '') {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(this.state.file);

            fileReader.addEventListener('load', event => {
                let base64 = fileReader.result;
                this.setState({base64: base64});
                // this.state.updateBase64(base64);
            });
        }
    }


    render() {
        return (
            <div className="file-card-border">
                <div className="file-card-margin">
                    <div className={"file-card-page " +(this.state.pageSize === 'adjusted' ? 'file-card-page-adjusted' : this.state.pageOrientation === 'portrait' ? 'file-card-page-vertical' : 'file-card-page-horizontal')}>
                        <img className="file-card-image" src={this.state.base64} style={{
                            "maxWidth": (this.state.imageRotation % 180 === 0 ? "var(--width)" : "var(--height)"),
                            "maxHeight": (this.state.imageRotation % 180 === 0 ? "var(--height)" : "var(--width)")
                        }}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default FileCard;