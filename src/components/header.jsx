function Header() {
    return (
        <header className="header">
            <img className="header-logo" alt='Bastián Paredes' src={require("../images/logo.png")}/>
            <h1 className="header-tittle">Imagen a PDF</h1>
        </header>
    );
}

export default Header;