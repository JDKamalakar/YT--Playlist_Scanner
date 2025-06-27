import React from 'react';
import { AlertTriangle, X, Trash2, RefreshCw } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const iconColor = type === 'danger' ? 'text-error' : 'text-warning';
  const iconBg = type === 'danger' ? 'bg-error-container' : 'bg-warning-container';
  const confirmButtonColor = type === 'danger' 
    ? 'bg-error hover:bg-error/90 text-on-error'
    : 'bg-tertiary-container hover:bg-tertiary-container/90 text-on-tertiary-container';

  const getConfirmIcon = () => {
    if (confirmText.toLowerCase().includes('clear') || confirmText.toLowerCase().includes('delete')) {
      return <Trash2 className="w-4 h-4" />;
    }
    if (confirmText.toLowerCase().includes('refetch')) {
      return <RefreshCw className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 ${iconBg} rounded-full`}>
          <AlertTriangle className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h2 className="text-xl font-semibold text-on-surface">{title}</h2>
      </div>

      <p className="text-on-surface-variant mb-6 leading-relaxed">{message}</p>
      
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-6 bg-surface-container text-on-surface rounded-full font-medium hover:bg-surface-container-high transition-all duration-225 hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`flex-1 py-3 px-6 ${confirmButtonColor} rounded-full font-medium transition-all duration-225 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2`}
        >
          {getConfirmIcon()}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};