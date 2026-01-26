import { useEffect, useCallback } from "react";

interface LightboxProps {
    imageSrc: string;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

const Lightbox = ({ imageSrc, onClose, onNext, onPrev, hasNext, hasPrev }: LightboxProps) => {
    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight" && hasNext) onNext();
            if (e.key === "ArrowLeft" && hasPrev) onPrev();
        },
        [onClose, onNext, onPrev, hasNext, hasPrev]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Prevent event bubbling when clicking on the image or controls
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition cursor-pointer z-50"
                title="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Previous Button */}
            {hasPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition cursor-pointer z-50"
                    title="Previous"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
            )}

            {/* Image Container */}
            <div className="relative max-w-full max-h-full p-4 flex items-center justify-center" onClick={handleContentClick}>
                <img
                    src={imageSrc}
                    alt="Full screen view"
                    className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                />
            </div>

            {/* Next Button */}
            {hasNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition cursor-pointer z-50"
                    title="Next"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Lightbox;
