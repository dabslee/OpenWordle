import React from "react";
import "./SheetDrawer.css";

interface SheetDrawerProps {
  open: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

const SheetDrawer: React.FC<SheetDrawerProps> = ({ open, children, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`sheet-overlay ${open ? "visible" : ""}`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className={`sheet-drawer bg-peach border-primary br-t-xxl pad-lg ${open ? "open" : ""}`}>
        {children}
      </div>
    </>
  );
};

export default SheetDrawer;
