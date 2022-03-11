import React from 'react';

class Modal extends React.Component {
    state = {
        display: false
    };


    render() {
        return this.state.display ?  (
            <div className="modal-container closed-modal">
                <div className="modal-content">
                    <img src={require("../images/loading.gif")} className="loading-gif"/>
                </div>
            </div>
        ) : <></>;
    }
}

export default Modal;