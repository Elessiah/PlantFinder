import React from "react";
import "./styles/Modal.css";

const Modal = ({ text }) => {
    if (text.length > 0) {
        return (
            <div className="modal">
                <div className={"modal-content"}>
                    <p>{text}</p>
                </div>
            </div>
        );
    }
}

export default Modal;