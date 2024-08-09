import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

interface BackdropProps {
    onClose: () => void;
}

interface ModalOverlayProps {
    children: React.ReactNode;
}

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Backdrop: React.FC<BackdropProps> = (props) => {
    return (
        <div className="backdrop" onClick={props.onClose} />
    );
};

const ModalOverlay: React.FC<ModalOverlayProps> = (props) => {
    return (
        <div className="modal">
            <div className="content">{props.children}</div>
        </div>
    );
};

const portalElement = document.getElementById('overlays') as HTMLElement;

const Modal: React.FC<ModalProps> = (props) => {
    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
            {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
        </Fragment>
    );
};

export default Modal;
