function Modal() {
    return (
        <div className="modal-container">
            <div className="modal-content">
                <img alt='Loading' src={require("../images/loading.gif")} className="loading-gif"/>
            </div>
        </div>
    );
}

export default Modal;