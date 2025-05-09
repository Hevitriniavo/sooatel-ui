import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa"; 

function Modal({ children, isOpen, setIsOpen, onConfirm }) {
    return (
        <>
            {createPortal(
                <>
                    {isOpen ? (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-25">
                            <div className="w-full h-full  flex justify-center items-center">
                                <div className="bg-white rounded-lg p-4 relative">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close"
                                    >
                                        <FaTimes size={20} />
                                    </button>
                                    {children}
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
