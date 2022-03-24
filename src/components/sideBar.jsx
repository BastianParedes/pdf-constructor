import React from 'react';
import { BsFillGearFill } from 'react-icons/bs';
import { FcAddImage } from 'react-icons/fc';

import styles from '../styles/sideBar.module.css';

import Dropzone from 'react-dropzone';
import pageSizes from '../pageSizes.json';



export default function SideBar(props) {
    let [openedSidebar, setOpenedSidebar] = React.useState(false);
    let [dropZoneActive, setDropZoneActive] = React.useState(false);

    let numberOfUploadedFiles = React.useRef(0);

    let MyDropZone = () => {
        let onDrop = (files) => {
            let newInfo = {};
            let newFiles = files.map(file => {
                numberOfUploadedFiles.current++;
                newInfo[numberOfUploadedFiles.current] = {base64: '', imageRotation: 0};
                return {
                    key: numberOfUploadedFiles.current,
                    file: file,
                };
            });
            setDropZoneActive(false);
            props.onDrop(newFiles, newInfo);
        }

        return (
            <Dropzone onDrop={onDrop} onDragOver={() => setDropZoneActive(true)} onDragLeave={() => setDropZoneActive(false)}>
                {({getRootProps, getInputProps}) => (
                    <div className={styles['dropzone'] + ' ' + styles[dropZoneActive ? 'dropzone-active' : '']} {...getRootProps()}>
                        <span className={styles['dropzone-icon']}><FcAddImage /></span>
                        <span className={styles['dropzone-text']}>{dropZoneActive ? 'Suelta tus archivos para cargarlos' : 'Arrastra y suelta los archivos aquí o haz click para buscarlos'}</span>
                    </div>
                )}
            </Dropzone>
        );
    }



    let PageSize = () => {
        return (
            <div className={styles['sidebar-section-page-size']}>
                <h2 className={styles['page-attribute-tittle']}>Tamaño de la página</h2>
                <select className={styles['page-size']} name='pageSize' value={props.pageSize} onChange={event => {props.updatePage(event.target.name, event.target.value)}}>
                    {pageSizes.dimensions.map((info, pos) => <option key={pos} value={info.value}>{info.textContent}</option>)}
                </select>
            </div>
        );
    };

    let PageOrientation = () => {
        return (
            <div className={styles['sidebar-section-page-orientation'] + ' ' + styles[props.pageSize === 'adjusted' ? 'sidebar-section-page-orientation-hidden' : '']}>
                <h2 className={styles['page-attribute-tittle']}>Orientación de la página</h2>
                <select className={styles['page-orientation']} name='pageOrientation' value={props.pageOrientation} onChange={event => {props.updatePage(event.target.name, event.target.value)}}>
                    <option value='portrait'>Vertical</option>
                    <option value='landscape'>Horizontal</option>
                </select>
            </div>
        );
    };


    return (
        <div className={styles['sidebar'] + ' ' + styles[openedSidebar ? '' : 'sidebar-closed']}>
            <div className={styles['sidebar-btn']} onClick={() => setOpenedSidebar(!openedSidebar)}>
                <BsFillGearFill />
            </div>
            <MyDropZone />
            <PageSize />
            <PageOrientation />
            <div className={styles['sidebar-section-generate-pdf']}>
                <button className={styles['generate-pdf-btn']} onClick={props.generatePdf}>Generar PDF</button>
            </div>
        </div>
    );
}

