import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, onClose }) => {
  // Handle clicks on the backdrop to close the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full">
        <img src={src} alt={alt} className="max-h-[90vh] w-auto h-auto rounded-lg" />
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
