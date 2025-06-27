import React, { useState, useRef } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { downloadBackup, restoreFromBackup } from '../utils/storage';
import { BackupData } from '../types';

interface BackupManagerProps {
  onClose: () => void;
  onRestoreComplete: () => void;
}

export const BackupManager: React.FC<BackupManagerProps> = ({ onClose, onRestoreComplete }) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [restoreMessage, setRestoreMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = () => {
    try {
      downloadBackup();
      setRestoreStatus('success');
      setRestoreMessage('Backup downloaded successfully!');
      setTimeout(() => setRestoreStatus('idle'), 3000);
    } catch (error) {
      setRestoreStatus('error');
      setRestoreMessage('Failed to create backup');
      setTimeout(() => setRestoreStatus('idle'), 3000);
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setRestoreStatus('idle');

    try {
      const backup: BackupData = await restoreFromBackup(file);
      
      localStorage.setItem('stored_playlists', JSON.stringify(backup.playlists));
      
      setRestoreStatus('success');
      setRestoreMessage(`Successfully restored ${backup.playlists.length} playlists from backup`);
      
      setTimeout(() => {
        onRestoreComplete();
        onClose();
      }, 2000);
    } catch (error) {
      setRestoreStatus('error');
      setRestoreMessage(error instanceof Error ? error.message : 'Failed to restore backup');
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Backup & Restore</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDownloadBackup}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Download Backup
            </button>

            <button
              onClick={handleRestoreClick}
              disabled={isRestoring}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isRestoring ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Restore from Backup
                </>
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />

          {restoreStatus !== 'idle' && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              restoreStatus === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {restoreStatus === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{restoreMessage}</span>
            </div>
          )}

          <div className="text-xs text-gray-500 bg-gray-50/50 p-3 rounded-lg">
            <p className="mb-1">
              <strong>Backup:</strong> Download your complete playlist data including all video titles and metadata.
            </p>
            <p>
              <strong>Restore:</strong> Upload a backup file to restore your saved playlists and detect deleted videos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};