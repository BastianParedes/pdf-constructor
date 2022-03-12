import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header.jsx';
import Main from './components/main.jsx';
import Footer from './components/footer.jsx';


import './styles/normalize.css';
import './styles/main.css';


ReactDOM.render(
    <React.StrictMode>
    <Header />
    <Main />
    <Footer />
    </React.StrictMode>,
    document.getElementById('root')
);




// //drag and drop
// let sortable = new Sortable(divFilesContainer, {
//     animation: 300,
//     ghostClass: 'file-card-border-ghostClass',
// 	dragClass: 'file-card-border-dragClass',
// });


