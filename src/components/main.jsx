import React from 'react';
import Dropzone from 'react-dropzone';

import {ReactSortable} from "react-sortablejs";
import jsPDF from 'jspdf';

import pageSizes from '../pageSizes.json';

import FileCard from './fileCard.jsx';
import Modal from './modal.jsx';

class Main extends React.Component {
    state = {
        files: [], // {key,  file, imageRotation}
        openedSidebar: false,
        dropZoneActive: false,
        pageSize: "adjusted",
        pageOrientation: "portrait",
        openedModal: false
    }

    numberOfUploadedFiles = 0;
    keyToBase64 = {}; //[{key:base64}]

    updatePage = event => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    generatePdf = () => {
        if (this.state.files.length === 0) {
            alert('No has ingresado ninguna imagen.');
            return;
        };

        this.setState({openedModal: true});
        let doc = new jsPDF();
        doc.deletePage(1);

        let promise = Promise.resolve();



        for (let info of this.state.files) {
            promise = promise.then(() => new Promise((resolve, reject) => {
                let base64 = this.keyToBase64[info.key];

                let image = new Image();
                image.src = base64;
                image.addEventListener('load', (event) => {
                    let imageWidth;
                    let imageHeight;
                    if (info.imageRotation === 0) { //imagen sin rotar
                        imageWidth = image.width;
                        imageHeight = image.height;

                    } else { // imagen rotada
                        const canvas = document.createElement('canvas');
                        let ctx = canvas.getContext("2d");
                        canvas.width = info.imageRotation % 180 === 0 ? image.width : image.height;
                        canvas.height = info.imageRotation % 180 === 0 ? image.height : image.width;

                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.rotate(-info.imageRotation * Math.PI / 180);
                        ctx.drawImage(image, image.width / -2, image.height / -2);

                        base64 = canvas.toDataURL();

                        let imageInfo = doc.getImageProperties(base64);
                        imageWidth = imageInfo['width'];
                        imageHeight = imageInfo['height'];
                    }

                    if (this.state.pageSize === 'adjusted') {
                        doc.addPage();
                        doc.internal.pageSize.setWidth(imageWidth);
                        doc.internal.pageSize.setHeight(imageHeight);
                        doc.addImage(base64, 'png', 0, 0, imageWidth, imageHeight);
                    } else {
                        doc.addPage(this.state.pageSize, this.state.pageOrientation);
                        let pageWidth = doc.internal.pageSize.getWidth();
                        let pageHeight = doc.internal.pageSize.getHeight();

                        let newImageWidth = pageWidth / pageHeight <= imageWidth / imageHeight ? pageWidth : imageWidth * pageHeight / imageHeight;
                        let newImageHeight = pageWidth / pageHeight <= imageWidth / imageHeight ? imageHeight * pageWidth / imageWidth : pageHeight;

                        let leftMargin = (pageWidth - newImageWidth) / 2;
                        let topMargin = (pageHeight - newImageHeight) / 2;

                        doc.addImage(base64, 'png', leftMargin, topMargin, newImageWidth, newImageHeight);
                    }
                    resolve();
                });
            }));
        };
        promise.then(() => new Promise((resolve, reject) => {
            this.setState({openedModal: false});
            doc.save('PDF constructor.pdf');
        }));
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


    rotateImage = (key) => {
        let updatedFiles = this.state.files.map(info => {
            if(info.key === key) {
                info['imageRotation'] = (info['imageRotation'] + 90) % 360;
            }
            return info;
        });
        this.setState({files: updatedFiles});
        console.log('rotar');
    }

    deleteFileCard = (key) => {
        let updatedFiles = this.state.files.filter(info => info.key !== key);
        this.setState({files: updatedFiles});
        console.log('borrar');
    }

    MyDropZone = () => {
        return (
            <Dropzone onDrop={this.onDrop} onDragOver={() => this.setState({dropZoneActive: true})} onDragLeave={() => this.setState({dropZoneActive: false})}>
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
                <div className="sidebar-btn" onClick={() => this.setState({openedSidebar: !this.state.openedSidebar})}>
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
                <ReactSortable className="div-files-container" animation='300' ghostClass='file-card-border-ghostClass' dragClass='file-card-border-dragClass' list={this.state.files} setList={(newState) => this.setState({files: newState})}>
                    {this.state.files.map((info) => <FileCard
                        key={info.key}
                        file={info.file}
                        imageRotation={info.imageRotation}
                        pageSize={this.state.pageSize}
                        pageOrientation={this.state.pageOrientation}
                        updateBase64={(base64) => {this.keyToBase64[info.key] = base64}}
                        rotateImage={() => this.rotateImage(info.key)}
                        deleteFileCard={() => {this.deleteFileCard(info.key)}}

                    />)}
                </ReactSortable>
                {this.state.openedModal ? <Modal /> : <></>}
            </main>
        );
    }
}


export default Main;