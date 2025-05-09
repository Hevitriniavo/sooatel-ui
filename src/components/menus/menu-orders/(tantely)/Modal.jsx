import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

function Modal({ children, isOpen, setIsOpen }) {
    return (
        <>
            {createPortal(
                <>
                    {isOpen ? (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
                            <div className="w-full h-full flex justify-center items-center">
                                <div className="bg-white   dark:bg-gray-800 rounded-lg shadow-lg p-6 relative mx-4 transition-all transform scale-95 opacity-0 animate-modal">
                                    <button
                                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close"
                                    >
                                        <FaTimes size={20} />
                                    </button>
                                    <div className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </>,
                document.body
            )}
        </>
    );
}

export default Modal;
