import React from 'react';

function FileCard(props) {

    let [src, setSrc] = React.useState(require('../images/loading image.gif'));
    let [imageRotation, setImageRotation] = React.useState(0);



    let rotateImage = () => {
        let newImageRotation = (imageRotation + 90) % 360
        setImageRotation(newImageRotation);
        props.rotateImage(newImageRotation);
    }

    React.useEffect(() => {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(props.file);
        fileReader.addEventListener('load', event => {
            let base64 = fileReader.result;
            setSrc(base64);
            props.updateBase64(base64);
        });
    }, []);

    return (
        <div className="file-card-border">
            <div className="file-card-margin">
            <BtnsContainer rotateImage={rotateImage} deleteFileCard={props.deleteFileCard}/>
                <div className={"file-card-page " +(props.pageSize === 'adjusted' ? 'file-card-page-adjusted' : props.pageOrientation === 'portrait' ? 'file-card-page-vertical' : 'file-card-page-horizontal')}>
                    <img className="file-card-image" alt={props.file.name} src={src} style={{
                        "maxWidth": (imageRotation % 180 === 0 ? "var(--width)" : "var(--height)"),
                        "maxHeight": (imageRotation % 180 === 0 ? "var(--height)" : "var(--width)"),
                        '--angle': imageRotation
                    }}/>
                </div>
            </div>
        </div>
    );
}


function BtnsContainer(props) {
    return (
        <div className='btns-container'>
            <button className='rotate-btn' onClick={props.rotateImage}>
                <i className="bx bx-rotate-left"></i>
            </button>
            <button className='delete-btn' onClick={props.deleteFileCard}>
                <i className="bx bx-x"></i>
            </button>
        </div>
    );
}

export default FileCard;