import React, { use } from "react";
import "./Modal.css";
import Text from "../Text";
import Icon from "../Icon/Icon";
import { useIsMobile } from "@/app/utils/isMobile";

interface ModalProps {
  open: boolean;
  variant: "success" | "error" | "info";
  header?: string;
  children: React.ReactNode;
  showAnimation: boolean;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  open,
  variant,
  header,
  children,
  showAnimation = true,
  onClose,
}) => {
  const isMobile = useIsMobile();

  if (!open) return null;

  const handleOverlayClick = () => {
    onClose?.();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent closing when clicking inside modal
  };

  const bgConfig = {
    success: { bg: "bg-sage" },
    error: { bg: "bg-light-red" },
    info: { bg: "bg-blue" },
  };

  const config = bgConfig[variant];

  return (
    <div
      className={`${showAnimation && "modal-animation"} modal-overlay`}
      onClick={handleOverlayClick}
    >
      <div
        className={`modal-background ${config.bg} br-xl border-primary drop-shadow col align-start justify-start ${isMobile ? "pad-lg" : "pad-xl"} gap-xl`}
        onClick={handleContentClick}
      >
        <div
          className="modal-text-container row justify-between align-start"
          style={{ textAlign: "left" }}
        >
          <Text className="text-headline-h1">{header?.toUpperCase()}</Text>
          <div className="flex align-center" style={{ height: "36px" }}>
            <Icon name="close" size="24px" onClick={onClose} />
          </div>
        </div>
        <div
          className={`${showAnimation && "content-animation"} modal-content bg-primary br-xl border-primary pad-lg flex align-center justify-center`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
