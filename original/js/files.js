"use strict";

const sidebar = document.querySelector('.sidebar');
const sidebarBtn = document.querySelector('.sidebar-btn');
const dropZone = document.querySelector('.dropzone');
const dropzoneBtn = document.querySelector('.dropzone-btn');
const dropzoneText = document.querySelector('.dropzone-text');
const paperSize = document.querySelector('.paper-size');
const sidebarSectionPageOrientation = document.querySelector('.sidebar-section-page-orientation');
const paperOrientation = document.querySelector('.paper-orientation');
const divFilesContainer = document.querySelector('.div-files-container');
const submitBtn = document.querySelector('.generate-pdf-btn');
const modalContainer = document.querySelector('.modal-container');

const btnsContainer = document.createElement('div');
const divRotateBtn = document.createElement('div');
const divDeleteBtn = document.createElement('div');

// fileCardPaper.classList.add(paperSize.value === 'adjusted' ? 'file-card-paper-adjusted' : paperOrientation.value === 'portrait' ? 'file-card-paper-vertical' : 'file-card-paper-horizontal');
//genera el contenedor de botones y los botones
btnsContainer.classList.add('btns-container');
divRotateBtn.classList.add('rotate-btn');
divDeleteBtn.classList.add('delete-btn');

divRotateBtn.innerHTML = '<i class="bx bx-rotate-left"></i>';
divDeleteBtn.innerHTML = '<i class="bx bx-x"></i>';

btnsContainer.appendChild(divRotateBtn);
btnsContainer.appendChild(divDeleteBtn);

sidebarBtn.addEventListener('click', event => sidebar.classList.toggle('sidebar-closed'));
dropzoneBtn.addEventListener('change', function (event) {
    event.preventDefault();
    loadImages(this.files);
    this.value = ''; // quita los archivos del dropzoneBtn, para que puedan ser cargados denuevo
});

paperSize.addEventListener('change', function (event) {
    if (this.value === 'adjusted') {
        sidebarSectionPageOrientation.classList.add('sidebar-section-page-orientation-hidden');
        paperOrientation.setAttribute('disabled', '');
    } else {
        sidebarSectionPageOrientation.classList.remove('sidebar-section-page-orientation-hidden');
        paperOrientation.removeAttribute('disabled');
    };

    updatefileCardPaperSizeOrientation();
});

paperOrientation.addEventListener('change', updatefileCardPaperSizeOrientation);

submitBtn.addEventListener('click', generatePdf);
divRotateBtn.addEventListener('click', rotateFileCardImage);
divDeleteBtn.addEventListener('click', deleteFileCard);




dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    this.classList.add('dropzone-active');
    dropzoneText.textContent = 'Suelta tus archivos para cargarlos';
});

dropZone.addEventListener('dragleave', function (event) {
    this.classList.remove('dropzone-active');
    dropzoneText.textContent = 'Arrastra y suelta los archivos aquí o';
});

dropZone.addEventListener('drop', function (event) {
    event.preventDefault();
    loadImages(event.dataTransfer.files);
    this.classList.remove('dropzone-active');
    dropzoneText.textContent = 'Arrastra y suelta los archivos aquí o';
});






//drag and drop
let sortable = new Sortable(divFilesContainer, {
    animation: 300,
    ghostClass: 'file-card-border-ghostClass',
	dragClass: 'file-card-border-dragClass',
    onStart: event => {
        divFilesContainer.setAttribute('dragging', 'true');
        btnsContainer.setAttribute('display', 'none');
    },
    onEnd: event => {
        divFilesContainer.setAttribute('dragging', 'false');

        //agrega los botones al recién soltado
        let fileCardBorder = event.item;
        let fileCardMargin = fileCardBorder.querySelector('.file-card-margin');

        if (!fileCardMargin.contains) {fileCardMargin.appendChild(btnsContainer)};
        
        btnsContainer.setAttribute('display', 'flex');
    },
});





function loadImages(files) {
    modalContainer.classList.remove('closed-modal');
    
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    let fragment = document.createDocumentFragment();
    let promises = [];
    
    for (let file of files) { // recorre los archivos recién seleccionados

        let fileType = file.type;
        if (! validExtensions.includes(fileType)) {continue};

        let fileCardBorder = document.createElement('div');
        let fileCardMargin = document.createElement('div');
        let fileCardPaper = document.createElement('div');
        let fileCardImage = document.createElement('img');
        let fileReader = new FileReader(); //permite leer las imágenes para luego mostrarlas en pantalla

        fileCardBorder.classList.add('file-card-border');
        fileCardMargin.classList.add('file-card-margin');
        fileCardPaper.classList.add('file-card-paper');
        fileCardPaper.classList.add(paperSize.value === 'adjusted' ? 'file-card-paper-adjusted' : paperOrientation.value === 'portrait' ? 'file-card-paper-vertical' : 'file-card-paper-horizontal');
        fileCardImage.classList.add('file-card-image');

        fragment.appendChild(fileCardBorder);
        fileCardBorder.appendChild(fileCardMargin);
        fileCardMargin.appendChild(fileCardPaper);
        fileCardPaper.appendChild(fileCardImage);

        fileReader.readAsDataURL(file);

        fileCardBorder.addEventListener('mouseenter', event => { //agrega los botones de la carta
            if (divFilesContainer.getAttribute('dragging') === 'false') {fileCardMargin.prepend(btnsContainer)};
        });

        fileCardBorder.addEventListener('mouseleave', event => { // quita los botones de la carta
            if (fileCardMargin.contains(btnsContainer)) {fileCardMargin.removeChild(btnsContainer)};
        });


        let promise = new Promise((resolve, reject) => {
            fileReader.addEventListener('load', function (event) {
                let base64 = this.result;
                fileCardImage.setAttribute('src', base64); // pone la imagen en el html
                resolve();
            });
        });

        promises.push(promise);
    };

    divFilesContainer.appendChild(fragment);

    Promise.all(promises).then(responses => {
        modalContainer.classList.add('closed-modal');
    });
};


function rotateFileCardImage(event) {
    let angles = ['0', '90', '180', '270'];
    let fileCardMargin = btnsContainer.parentElement;
    let fileCardImage = fileCardMargin.querySelector('.file-card-image');
    

    let currentAngle = getComputedStyle(fileCardImage).getPropertyValue('--angle').replaceAll(' ','');
    let currentIndex = angles.indexOf(currentAngle);
    let newAngle = parseInt(angles[(currentIndex + 1) % angles.length]);
    fileCardImage.style.setProperty('--angle', newAngle);
    
    let newWidth = newAngle % 180 === 0 ? 'var(--width)' : 'var(--height)';
    let newHeight = newAngle % 180 === 0 ? 'var(--height)' : 'var(--width)';

    fileCardImage.style.setProperty('max-width', newWidth);
    fileCardImage.style.setProperty('max-height', newHeight);
};


function deleteFileCard(event) {
    let fileCardBorder = divDeleteBtn.parentElement.parentElement.parentElement;
    divFilesContainer.removeChild(fileCardBorder);
};


function generatePdf(event) {
    if (divFilesContainer.children.length === 0) {
        alert('No has ingresado ninguna imagen.');
        return;
    };
    modalContainer.classList.remove('closed-modal');
    let doc = new jspdf.jsPDF();
    doc.deletePage(1);

    let promise = Promise.resolve();
    
    for (let fileCardImage of divFilesContainer.querySelectorAll('.file-card-image')) {
        promise = promise.then(() => new Promise((resolve, reject) => {
            let angle = parseInt(getComputedStyle(fileCardImage).getPropertyValue('--angle'));
            let base64 = fileCardImage.src;

            let image = new Image();
            image.src = base64;
            image.addEventListener('load', function (event) {
                let imageWidth;
                let imageHeight;
                if (angle === 0) { //imagen sin rotar
                    imageWidth = this.width;
                    imageHeight = this.height;
                    
                } else { // imagen rotada
                    const canvas = document.createElement('canvas');
                    let ctx = canvas.getContext("2d");
                    canvas.width = angle % 180 === 0 ? this.width : this.height;
                    canvas.height = angle % 180 === 0 ? this.height : this.width;
                
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(-angle * Math.PI / 180);
                    ctx.drawImage(this, this.width / -2, this.height / -2);
                
                    base64 = canvas.toDataURL();

                    let imageInfo = doc.getImageProperties(base64);
                    imageWidth = imageInfo['width'];
                    imageHeight = imageInfo['height'];
                }

                if (paperSize.value === 'adjusted') {
                    doc.addPage();
                    doc.internal.pageSize.setWidth(imageWidth);
                    doc.internal.pageSize.setHeight(imageHeight);
                    doc.addImage(base64, 'png', 0, 0, imageWidth, imageHeight);
                } else {
                    doc.addPage(paperSize.value, paperOrientation.value);
                    let paperWidth = doc.internal.pageSize.getWidth();
                    let paperHeight = doc.internal.pageSize.getHeight();

                    let newImageWidth = paperWidth / paperHeight <= imageWidth / imageHeight ? paperWidth : imageWidth * paperHeight / imageHeight;
                    let newImageHeight = paperWidth / paperHeight <= imageWidth / imageHeight ? imageHeight * paperWidth / imageWidth : paperHeight;

                    let leftMargin = (paperWidth - newImageWidth) / 2;
                    let topMargin = (paperHeight - newImageHeight) / 2;
                    

                    doc.addImage(base64, 'png', leftMargin, topMargin, newImageWidth, newImageHeight);
                }

                
                resolve();
            });
        }));
    };
    promise.then(() => new Promise((resolve, reject) => {
        modalContainer.classList.add('closed-modal');
        doc.save('PDF constructor.pdf');
    }));
};




function updatefileCardPaperSizeOrientation() {
    for (let fileCardPaper of divFilesContainer.querySelectorAll('.file-card-paper')) {
        fileCardPaper.classList.remove('file-card-paper-adjusted');
        fileCardPaper.classList.remove('file-card-paper-vertical');
        fileCardPaper.classList.remove('file-card-paper-horizontal');
        fileCardPaper.classList.add(paperSize.value === 'adjusted' ? 'file-card-paper-adjusted' : paperOrientation.value === 'portrait' ? 'file-card-paper-vertical' : 'file-card-paper-horizontal');
    }
}















