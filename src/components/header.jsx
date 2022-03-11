import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <header className="header">
                <img className="header-logo" src={require("../images/logo.png")}/>
                <h1 className="header-tittle">Imagen a PDF</h1>
            </header>
        );
    };
}

export default Header;