import React from 'react';
import { FiRotateCcw } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import styles from '../styles/fileCard.module.css';

export default function FileCard(props) {

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
        <div className={styles['file-card-border']}>
            <div className={styles['file-card-margin']}>
            <BtnsContainer rotateImage={rotateImage} deleteFileCard={props.deleteFileCard}/>
                <div className={styles['file-card-page'] + ' ' + styles[props.pageSize === 'adjusted' ? 'file-card-page-adjusted' : props.pageOrientation === 'portrait' ? 'file-card-page-vertical' : 'file-card-page-horizontal']}>
                    <img className={styles['file-card-image']} alt={props.file.name} src={src} style={{
                        'maxWidth': (imageRotation % 180 === 0 ? 'var(--width)' : 'var(--height)'),
                        'maxHeight': (imageRotation % 180 === 0 ? 'var(--height)' : 'var(--width)'),
                        '--angle': imageRotation
                    }}/>
                </div>
            </div>
        </div>
    );
}


function BtnsContainer(props) {
    return (
        <div className={styles['btns-container'] + ' btns-container'}>
            <button className={styles['rotate-btn']} onClick={props.rotateImage}>
                <FiRotateCcw />
            </button>
            <button className={styles['delete-btn']} onClick={props.deleteFileCard}>
                <IoMdClose />
            </button>
        </div>
    );
}
