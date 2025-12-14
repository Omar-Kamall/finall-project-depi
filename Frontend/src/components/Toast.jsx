import { useEffect, useState } from "react";
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from "react-icons/hi";

const Toast = ({ message, type = "success", onClose, duration = 1000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <HiCheckCircle className="h-5 w-5 text-green-500" />,
    error: <HiXCircle className="h-5 w-5 text-red-500" />,
    info: <HiInformationCircle className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={`${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } transition-all duration-300 ease-in-out transform mb-4 max-w-sm w-full border rounded-lg shadow-lg ${bgColors[type]} p-4 flex items-start gap-3`}
    >
      <div className="shrink-0">{icons[type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(), 300);
        }}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition"
      >
        <HiX className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;

