import React from "react";
import "./Loader.css";

const Loader: React.FC = () => {
  return (
    <div className="loader-container bg-primary">
      <div className="loader-frame ">
        <div className="loader-cube cube1 border-primary bg-peach drop-shadow br-circle"></div>
        <div className="loader-cube cube2 border-primary bg-yellow drop-shadow br-circle"></div>
        <div className="loader-cube cube3 border-primary bg-blue drop-shadow br-circle"></div>
      </div>
    </div>
  );
};

export default Loader;
