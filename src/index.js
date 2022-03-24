import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import './styles/general.css';

import Header from './components/header.jsx';
import Main from './components/main.jsx';
import Footer from './components/footer.jsx';




ReactDOM.render(
    <React.StrictMode>
    <Header />
    <Main />
    <Footer />
    </React.StrictMode>,
    document.getElementById('root')
);



