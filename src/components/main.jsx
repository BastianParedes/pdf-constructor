import React from 'react';
import Dropzone from 'react-dropzone';

import Sortable from 'sortablejs';
import jsPDF from 'jspdf';

import pageSizes from '../pageSizes.json';

import FileCard from './fileCard.jsx';

class Main extends React.Component {
    state = {
        files: [], // {key,  file, imageRotation, pageSize, pageOrientation,base64}
        openedSidebar: false,
        dropZoneActive: false,
        pageSize: "adjusted",
        pageOrientation: "portrait",
        numberOfUploadedFiles: 0
    }

    toggleSidebar = () => {
        this.setState({openedSidebar: !this.state.openedSidebar});
    }

    updatePageSize = event => {
        this.setState({pageSize: event.target.value});
        this.state.files.forEach(info => {
            info['pageSize'] = event.target.value
        });
    }

    updatePageOrientation = event => {
        this.setState({pageOrientation: event.target.value});
        this.state.files.forEach(info => {
            info['pageOrientation'] = event.target.value
        });
    }

    generatePdf = () => {
        console.log(this.state);
    }

    activateDropZone = () => {
        this.setState({dropZoneActive: true});
    }

    deactivateDropZone = () => {
        this.setState({dropZoneActive: false});
    }

    onDrop = files => {
        files.forEach(file => {
            this.setState({
                files: [...this.state.files, {
                    key: this.state.numberOfUploadedFiles,
                    file: file,
                    imageRotation: 0,
                    pageSize: this.state.pageSize,
                    pageOrientation: this.state.pageOrientation,
                    base64: ''
                }],
                numberOfUploadedFiles: this.state.numberOfUploadedFiles + 1
            });
        });
        this.deactivateDropZone();
    }


    MyDropZone = () => {
        return (
            <Dropzone onDrop={this.onDrop} onDragOver={this.activateDropZone} onDragLeave={this.deactivateDropZone}>
                {({getRootProps, getInputProps}) => (
                    <div className={"dropzone " + (this.state.dropZoneActive ? 'dropzone-active' : '')} {...getRootProps()}>
                        <span className="dropzone-icon"><i className='bx bx-image-add'></i></span>
                        <span className="dropzone-text">{this.state.dropZoneActive ? 'Suelta tus archivos para cargarlos' : 'Arrastra y suelta los archivos aquí o haz click para buscarlos'}</span>
                    </div>
                )}
            </Dropzone>
        );
    };

    PageSize = () => {
        return (
            <div className="sidebar-section-page-size">
                <h2 className="page-attribute-tittle">Tamaño de la página</h2>
                <select className="page-size" onChange={this.updatePageSize} name="pageSize">
                    {pageSizes.dimensions.map((info, pos) => <option key={pos} value={info.value}>{info.textContent}</option>)}
                </select>
            </div>
        );
    };

    PageOrientation = () => {
        return (
            <div className={"sidebar-section-page-orientation " + (this.state.pageSize === "adjusted" ? "sidebar-section-page-orientation-hidden" : '')}>
                <h2 className="page-attribute-tittle">Orientación de la página</h2>
                <select className="page-orientation" onChange={this.updatePageOrientation}>
                    <option value="portrait">Vertical</option>
                    <option value="landscape">Horizontal</option>
                </select>
            </div>
        );
    };

    Sidebar = () => {
        return (
            <div className={"sidebar " + (this.state.openedSidebar ? '' : 'sidebar-closed')}>
                <div className="sidebar-btn" onClick={this.toggleSidebar}>
                    <i className='bx bxs-cog'></i>
                </div>
                <this.MyDropZone />
                <this.PageSize />
                <this.PageOrientation />
                <div className="sidebar-section-generate-pdf">
                    <button className="generate-pdf-btn" onClick={this.generatePdf}>Generar PDF</button>
                </div>
            </div>
        );
    };

    render() {
        return (
            <main className="main">
                <this.Sidebar />
                <div className="div-files-container" dragging="false">
                    {this.state.files.map((info) => <FileCard key={info.key} file={info.file} imageRotation={info.imageRotation} pageSize={info.pageSize} pageOrientation={info.pageOrientation} base64='' updateBase64={base64 => {
                        this.state.files.filter(lookingInfo => lookingInfo.key === info.key)[0]['base64'] = base64;
                    }}/>)}
                </div>
            </main>
        );
    }
}


export default Main;