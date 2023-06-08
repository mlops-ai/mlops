import React from "react";
import {ToastContainer} from "react-toastify";

function Toast(props) {
    return (
        <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover={false}
            theme="light"
        />
    )
}

export default Toast;