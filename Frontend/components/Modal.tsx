import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from "react-icons/fi";

interface ModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUnderstood: () => void;
  status: 'success' | 'info' | 'fail';
  confirmText?: string;
}


const Modal: React.FC<ModalProps> = ({ title, message, isOpen, setIsOpen, onUnderstood, status, confirmText }) => {
  // Function to select background style based on status
  const getBackgroundStyle = () => {
    switch (status) {
      case 'success':
        return "bg-gradient-to-br from-blue-400 to-indigo-600"; // Adjusted to blue-indigo gradient
      case 'info':
        return "bg-gradient-to-br from-violet-600 to-indigo-600"; // Violet-indigo gradient for info
      case 'fail':
        return "bg-gradient-to-br from-red-600 to-purple-600"; // Red-purple gradient for errors
      default:
        return "bg-gradient-to-br from-violet-600 to-indigo-600"; // Default to violet-indigo gradient
    }
  };

  // Determine the icon based on status
  const Icon = () => {
    switch (status) {
      case 'success':
        return <FiCheckCircle className="text-blue-500" />; // Blue icon for success
      case 'info':
        return <FiInfo className="text-indigo-500" />; // Indigo icon for info
      case 'fail':
        return <FiXCircle className="text-red-500" />; // Red icon for fail
      default:
        return <FiAlertCircle className="text-indigo-500" />; // Default to indigo icon
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer bg-slate-900/20 backdrop-blur p-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className={`${getBackgroundStyle()} text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden`}
          >
            <div className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24">
              <Icon />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl grid place-items-center">
                <Icon />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                {title}
              </h3>
              <p className="text-center mb-6">
                {message}
              </p>
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onUnderstood();
                  }}
                  className="bg-white hover:opacity-90 transition-opacity text-black font-semibold py-2 rounded"
                >
                  Understood!
                </button>
                {confirmText && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold py-2 rounded"
                  >
                    Nah, go back
                  </button>)}

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default Modal;
