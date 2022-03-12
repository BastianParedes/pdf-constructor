import React from 'react';

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

    

function FileCard(props) {
    let [base64, setBase64] = React.useState('');

    React.useEffect(() => {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(props.file);
        fileReader.addEventListener('load', event => {
            let newBase64 = fileReader.result;
            setBase64(newBase64);
            props.updateBase64(newBase64);
        });
    }, []);


    return (
        <div className="file-card-border">
            <div className="file-card-margin">
            <BtnsContainer rotateImage={props.rotateImage} deleteFileCard={props.deleteFileCard}/>
                <div className={"file-card-page " +(props.pageSize === 'adjusted' ? 'file-card-page-adjusted' : props.pageOrientation === 'portrait' ? 'file-card-page-vertical' : 'file-card-page-horizontal')}>
                    <img className="file-card-image" src={base64} style={{
                        "maxWidth": (props.imageRotation % 180 === 0 ? "var(--width)" : "var(--height)"),
                        "maxHeight": (props.imageRotation % 180 === 0 ? "var(--height)" : "var(--width)"),
                        '--angle': props.imageRotation
                    }}/>
                </div>
            </div>
        </div>
    );
}

export default FileCard;