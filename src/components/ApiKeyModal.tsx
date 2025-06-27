import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Modal } from './Modal';
import { ConfirmationModal } from './ConfirmationModal';
import { encryptApiKey, decryptApiKey } from '../utils/youtube';
import { saveApiKey, getApiKey, clearApiKey } from '../utils/storage';

interface ApiKeyModalProps {
  onClose: () => void;
  onApiKeyChange: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const stored = getApiKey();
    if (stored) {
      setIsStored(true);
      const decrypted = decryptApiKey(stored);
      onApiKeyChange(decrypted);
    }
  }, [onApiKeyChange]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid API key' });
      return;
    }

    setIsLoading(true);
    try {
      const encrypted = encryptApiKey(apiKey);
      saveApiKey(encrypted);
      setIsStored(true);
      onApiKeyChange(apiKey);
      setApiKey('');
      setMessage({ type: 'success', text: 'API key saved successfully!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save API key' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConfirm = () => {
    clearApiKey();
    setIsStored(false);
    onApiKeyChange('');
    setMessage({ type: 'success', text: 'API key cleared successfully!' });
    setShowConfirmClear(false);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose} title="YouTube API Key">
        {!isStored ? (
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your YouTube API key"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="text-xs text-gray-500 bg-blue-50/50 p-3 rounded-lg">
              <p className="mb-1">
                <strong>How to get your API key:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to Google Cloud Console</li>
                <li>Create a new project or select existing</li>
                <li>Enable YouTube Data API v3</li>
                <li>Create credentials (API key)</li>
                <li>Copy and paste the key here</li>
              </ol>
            </div>

            <button
              onClick={handleSave}
              disabled={isLoading || !apiKey.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Save API Key
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">API key is configured</span>
            </div>
            
            <button
              onClick={() => setShowConfirmClear(true)}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear API Key
            </button>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 animate-fade-in ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
        onConfirm={handleClearConfirm}
        title="Clear API Key?"
        message="Are you sure you want to clear the API key? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};