import React from "react";
import "./Modal.css";
import Text from "../Text";
import Icon from "../Icon/Icon";

interface ModalProps {
  open: boolean;
  variant: 'success' | 'error' | 'info'
  header?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ open, variant, header, children, onClose }) => {
  if (!open) return null;

  const handleOverlayClick = () => {
    onClose?.();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent closing when clicking inside modal
  };

  const bgConfig = {
    success: {bg: "bg-green"},
    error: {bg: "bg-red"},
    info: {bg: "bg-blue"}
  }

  const config = bgConfig[variant]

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className={`modal-background ${config.bg} br-lg border-primary drop-shadow col align-start justify-start pad-xl gap-xl`} onClick={handleContentClick}>
            <div className="modal-text-container row justify-between align-center">
                <Text className="text-headline-h1">{header?.toUpperCase()}</Text>
                <Icon name="close" size="24px" onClick={handleContentClick}/>
            </div>
            <div className="modal-content bg-primary br-md border-primary pad-lg flex align-center justify-center">
                {children}
            </div>
        </div>
    </div>
  );
};

export default Modal;
