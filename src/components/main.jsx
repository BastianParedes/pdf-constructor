import React from 'react';
import {ReactSortable} from 'react-sortablejs';
import jsPDF from 'jspdf';

import styles from '../styles/main.module.css';

import Sidebar from './sideBar.jsx'
import FileCard from './fileCard.jsx';
import Modal from './modal.jsx';

export default class Main extends React.Component {
    state = {
        files: [], // {key,  file}
        pageSize: 'adjusted',
        pageOrientation: 'portrait',
        openedModal: false
    }

    infoToGeneratePdf = {}; //{key:{base64, imageRotation}}}

    generatePdf = () => {
        this.checkIfEveryBase64IsLoaded();
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
                let base64 = this.infoToGeneratePdf[info.key]['base64'];
                let imageRotation = this.infoToGeneratePdf[info.key]['imageRotation'];

                let image = new Image();
                image.src = base64;
                image.addEventListener('load', (event) => {
                    let imageWidth;
                    let imageHeight;
                    if (imageRotation === 0) { //imagen sin rotar
                        imageWidth = image.width;
                        imageHeight = image.height;

                    } else { // imagen rotada
                        const canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        canvas.width = imageRotation % 180 === 0 ? image.width : image.height;
                        canvas.height = imageRotation % 180 === 0 ? image.height : image.width;

                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.rotate(-imageRotation * Math.PI / 180);
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

    deleteFileCard = (key) => {
        let updatedFiles = this.state.files.filter(info => info.key !== key);
        this.setState({files: updatedFiles});
    }

    checkIfEveryBase64IsLoaded = () => {
        for (let file of this.state.files) {
            if (this.infoToGeneratePdf[file.key]['base64'] === '') {
                return;
            }                
        }
        this.setState({openedModal: false});
    }

    render() {
        return (
            <main className={styles['main']}>

                <Sidebar pageSize={this.state.pageSize} pageOrientation={this.state.pageOrientation} updatePage={(pagePropertie, newValue) => {this.setState({[pagePropertie]: newValue})}} generatePdf={this.generatePdf} onDrop={(newFiles, newInfo) => {
                    this.infoToGeneratePdf = {...this.infoToGeneratePdf, ...newInfo};
                    this.setState({files: [...this.state.files, ...newFiles], openedModal: true});
                }}/>

                <ReactSortable className={styles['div-files-container']} animation='300' ghostClass={styles['file-card-border-ghostClass']} list={this.state.files} setList={(newState) => this.setState({files: newState})}>
                    {this.state.files.map((info) => <FileCard
                        key={info.key}
                        file={info.file}
                        pageSize={this.state.pageSize}
                        pageOrientation={this.state.pageOrientation}
                        updateBase64={(base64) => {
                            this.infoToGeneratePdf[info.key]['base64'] = base64
                            this.checkIfEveryBase64IsLoaded()
                        }}
                        rotateImage={(imageRotation) => {this.infoToGeneratePdf[info.key]['imageRotation'] = imageRotation}}
                        deleteFileCard={() => {this.deleteFileCard(info.key)}}
                    />)}
                </ReactSortable>
                {this.state.openedModal ? <Modal /> : <></>}
            </main>
        );
    }
}

