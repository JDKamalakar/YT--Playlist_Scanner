import React, { useState } from 'react';
import { Youtube, Key, History, Info, Upload } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';
import { BackupManager } from './BackupManager';
import { HistoryPanel } from './HistoryPanel';
import { AboutModal } from './AboutModal';

interface NavbarProps {
  onApiKeyChange: (apiKey: string) => void;
  onRestoreComplete: () => void;
  onPlaylistSelect: (playlistId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onApiKeyChange, 
  onRestoreComplete,
  onPlaylistSelect 
}) => {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40 shadow-lg rounded-b-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-12">
                <Youtube className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Playlist Analyzer
              </h1>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistoryPanel(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <History className="w-4 h-4 transition-transform duration-200 hover:rotate-12" />
                <span className="hidden sm:inline">History</span>
              </button>

              <button
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Key className="w-4 h-4 transition-transform duration-200 hover:rotate-12" />
                <span className="hidden sm:inline">API Key</span>
              </button>

              <button
                onClick={() => setShowBackupModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Upload className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                <span className="hidden sm:inline">Backup</span>
              </button>

              <button
                onClick={() => setShowAboutModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Info className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                <span className="hidden sm:inline">About</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      {showApiKeyModal && (
        <ApiKeyModal
          onClose={() => setShowApiKeyModal(false)}
          onApiKeyChange={onApiKeyChange}
        />
      )}

      {showBackupModal && (
        <BackupManager
          onClose={() => setShowBackupModal(false)}
          onRestoreComplete={onRestoreComplete}
        />
      )}

      {showHistoryPanel && (
        <HistoryPanel
          onClose={() => setShowHistoryPanel(false)}
          onPlaylistSelect={onPlaylistSelect}
        />
      )}

      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}
    </>
  );
};