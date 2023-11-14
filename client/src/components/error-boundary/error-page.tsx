import { Button } from "../ui/button";
import { Loading } from "../icons";

interface ErrorPageProps {
    error: any;
    resetErrorBoundary: () => void;
    Icon: any;
    title: string;
    messageContent: React.ReactNode;
}

const ErrorPage = ({
    error,
    resetErrorBoundary,
    Icon,
    title,
    messageContent,
}: ErrorPageProps) => {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen p-16">
            <div className="mb-6 text-6xl">
                <a
                    className="flex items-center flex-grow-0 flex-shrink-0 w-full px-3 justify-normal"
                    href="/"
                >
                    <img src="/mlops.svg" alt="logo" className="w-16 h-16" />
                    <span className="block ml-2 font-bold text-mlops-primary-tx dark:text-mlops-primary-tx-dark font-logo">
                        MLOps
                    </span>
                </a>
            </div>
            <Icon className="flex-shrink-0 w-16 h-16 text-mlops-gray dark:text-zinc-400" />
            <h1 className="mb-3 text-3xl font-semibold text-mlops-gray dark:text-zinc-400">
                {title}
            </h1>
            <div className="flex flex-col items-center justify-center mb-3">
                <div className="mb-3 text-center">{messageContent}</div>
                <p>
                    If the problem persists, report it{" "}
                    <a
                        href="https://github.com/kajetsz/mlops/issues"
                        className="transition duration-300 text-zinc-400 hover:underline"
                    >
                        here
                    </a>
                    .
                </p>
            </div>
            <Button
                variant="mlopsPrimary"
                className="flex items-center"
                onClick={resetErrorBoundary}
            >
                <Loading className="inline mr-1 animate-spin" />
                Refresh
            </Button>
        </div>
    );
};

export default ErrorPage;
