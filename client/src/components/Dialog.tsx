import { X } from "lucide-react";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Dialog = ({ isOpen, onClose, children }: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-dark-5 p-6 rounded-lg z-50">
        <button onClick={onClose} className="float-right text-xl text-white"><X size={20}/></button>
        {children}
      </div>
    </div>
  );
};

export default Dialog;