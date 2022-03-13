import React from 'react';
import Dropzone from 'react-dropzone';

import pageSizes from '../pageSizes.json';



function SideBar(props) {
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
                    <div className={"dropzone " + (dropZoneActive ? 'dropzone-active' : '')} {...getRootProps()}>
                        <span className="dropzone-icon"><i className='bx bx-image-add'></i></span>
                        <span className="dropzone-text">{dropZoneActive ? 'Suelta tus archivos para cargarlos' : 'Arrastra y suelta los archivos aquí o haz click para buscarlos'}</span>
                    </div>
                )}
            </Dropzone>
        );
    }



    let PageSize = () => {
        return (
            <div className="sidebar-section-page-size">
                <h2 className="page-attribute-tittle">Tamaño de la página</h2>
                <select className="page-size" name="pageSize" value={props.pageSize} onChange={event => {props.updatePage(event.target.name, event.target.value)}}>
                    {pageSizes.dimensions.map((info, pos) => <option key={pos} value={info.value}>{info.textContent}</option>)}
                </select>
            </div>
        );
    };

    let PageOrientation = () => {
        return (
            <div className={"sidebar-section-page-orientation " + (props.pageSize === "adjusted" ? "sidebar-section-page-orientation-hidden" : '')}>
                <h2 className="page-attribute-tittle">Orientación de la página</h2>
                <select className="page-orientation" name="pageOrientation" value={props.pageOrientation} onChange={event => {props.updatePage(event.target.name, event.target.value)}}>
                    <option value="portrait">Vertical</option>
                    <option value="landscape">Horizontal</option>
                </select>
            </div>
        );
    };


    return (
        <div className={"sidebar " + (openedSidebar ? '' : 'sidebar-closed')}>
            <div className="sidebar-btn" onClick={() => setOpenedSidebar(!openedSidebar)}>
                <i className='bx bxs-cog'></i>
            </div>
            <MyDropZone />
            <PageSize />
            <PageOrientation />
            <div className="sidebar-section-generate-pdf">
                <button className="generate-pdf-btn" onClick={props.generatePdf}>Generar PDF</button>
            </div>
        </div>
    );
}


export default SideBar;