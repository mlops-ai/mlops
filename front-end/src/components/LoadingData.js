import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

function LoadingData(props) {

    return (
        <div className="w-100 d-flex align-items-center justify-content-center text-center" style={{padding: 128 + "px"}}>
            <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                <span className="material-symbols-rounded project-icon" style={{fontSize: 64 + "px"}}>
                    {props.icon}
                </span>
                <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>Loading {props.dataSection} ...</p>
                <p className="mb-3">Please, be patient.</p>
                <BounceLoader
                    color="#012970"
                    loading={true}
                    size={100}
                    speedMultiplier={1}
                />
            </div>
        </div>
    );

}

export default LoadingData;