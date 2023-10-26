import { toast } from "react-toastify";

interface ToastOptions {
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning" | "default";
    autoClose?: number;
}

export const createToast = ({
    id,
    message,
    type,
    autoClose = 3000,
}: ToastOptions) => {
    if (toast.isActive(id)) {
        toast.update(id, {
            render: message,
            type,
            autoClose,
        });
    } else {
        toast(message, {
            toastId: id,
            type,
            autoClose,
        });
    }
};
