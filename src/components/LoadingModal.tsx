interface LoadingModalProps {
    isOpen: boolean;
    message?: string;
}

const LoadingModal = ({ isOpen, message = "Uploading..." }: LoadingModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center max-w-sm w-full mx-4 border border-gray-100 dark:border-gray-700">
                {/* Spinner */}
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>

                {/* Message */}
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
                    {message}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Please wait while we process your file.
                </p>
            </div>
        </div>
    );
};

export default LoadingModal;
