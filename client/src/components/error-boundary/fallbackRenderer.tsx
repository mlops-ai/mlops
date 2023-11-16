import { AxiosError } from "axios";
import { FallbackProps } from "react-error-boundary";
import ErrorPage from "./error-page";
import { CloudOff } from "../icons";

export const fallbackRender = ({ error, resetErrorBoundary }: FallbackProps) => {
    if (error instanceof AxiosError) {
        if (error.code === "ERR_NETWORK") {
            return (
                <ErrorPage
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                    Icon={CloudOff}
                    title="Connection error"
                    messageContent={
                        <>
                            Opps, something went wrong while trying to connect
                            to the backend server. <br /> Please check if server
                            is running and try again.
                        </>
                    }
                />
            );
        }
    }
    return null;
};