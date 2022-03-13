import React from 'react';

function FileCard(props) {
    let [base64, setBase64] = React.useState('');
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
            let newBase64 = fileReader.result;
            setBase64(newBase64);
            props.updateBase64(newBase64);
        });
    }, [props]);
    console.log('render');

    return (
        <div className="file-card-border">
            <div className="file-card-margin">
            <BtnsContainer rotateImage={rotateImage} deleteFileCard={props.deleteFileCard}/>
                <div className={"file-card-page " +(props.pageSize === 'adjusted' ? 'file-card-page-adjusted' : props.pageOrientation === 'portrait' ? 'file-card-page-vertical' : 'file-card-page-horizontal')}>
                    <img className="file-card-image" alt={props.file.name} src={base64} style={{
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
            <div className='rotate-btn' onClick={props.rotateImage}>
                <i className="bx bx-rotate-left"></i>
            </div>
            <div className='delete-btn' onClick={props.deleteFileCard}>
                <i className="bx bx-x"></i>
            </div>
        </div>
    );
}

export default FileCard;