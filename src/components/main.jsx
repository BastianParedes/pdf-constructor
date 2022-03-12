import React from 'react';
import Dropzone from 'react-dropzone';

import Sortable from 'sortablejs';
import jsPDF from 'jspdf';

import pageSizes from '../pageSizes.json';

import FileCard from './fileCard.jsx';

class Main extends React.Component {
    state = {
        files: [], // {key,  file, imageRotation}
        openedSidebar: false,
        dropZoneActive: false,
        pageSize: "adjusted",
        pageOrientation: "portrait",
    }

    numberOfUploadedFiles = 0;
    keyToBase64 = {}; //[{key:base64}]

    toggleSidebar = () => {
        this.setState({openedSidebar: !this.state.openedSidebar});
    }

    updatePage = event => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    generatePdf = () => {
        console.log(this.state.files);
        console.log(this.keyToBase64);
    }

    activateDropZone = () => {
        this.setState({dropZoneActive: true});
    }

    deactivateDropZone = () => {
        this.setState({dropZoneActive: false});
    }

    onDrop = (files) => {
        let newFiles = files.map(file => {
            this.numberOfUploadedFiles++;
            return {
                key: this.numberOfUploadedFiles,
                file: file,
                imageRotation: 0,
            };
        });

        this.setState({
            files: [...this.state.files, ...newFiles],
            dropZoneActive: false,
        });
    }

    updateBase64 = (key, base64) => {
        this.keyToBase64[key] = base64;
    };

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
                <select className="page-size" onChange={this.updatePage} name="pageSize">
                    {pageSizes.dimensions.map((info, pos) => <option key={pos} value={info.value}>{info.textContent}</option>)}
                </select>
            </div>
        );
    };

    PageOrientation = () => {
        return (
            <div className={"sidebar-section-page-orientation " + (this.state.pageSize === "adjusted" ? "sidebar-section-page-orientation-hidden" : '')}>
                <h2 className="page-attribute-tittle">Orientación de la página</h2>
                <select className="page-orientation" onChange={this.updatePage} name="pageOrientation">
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
        console.log('render parent');
        return (
            <main className="main">
                <this.Sidebar />
                <div className="div-files-container" dragging="false">
                    {this.state.files.map((info) => <FileCard key={info.key} _key={info.key} file={info.file} imageRotation={info.imageRotation} pageSize={this.state.pageSize} pageOrientation={this.state.pageOrientation} updateBase64={this.updateBase64}/>)}
                </div>
            </main>
        );
    }
}


export default Main;