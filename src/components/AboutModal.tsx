import React from 'react';
import { Heart, Coffee, Github, Globe } from 'lucide-react';
import { Modal } from './Modal';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="About" size="lg">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-on-surface mb-3">
            YouTube Playlist Analyzer
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            A modern, feature-rich tool to analyze YouTube playlists with detailed statistics, 
            backup functionality, and beautiful design. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-on-surface">Features:</h4>
          <ul className="text-sm text-on-surface-variant space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Comprehensive playlist analysis
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Grid and table view modes
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Backup and restore functionality
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Deleted video detection
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Modern responsive design
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Secure API key management
            </li>
          </ul>
        </div>

        <div className="border-t border-outline-variant pt-6">
          <h4 className="font-medium text-on-surface mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-error animate-pulse" />
            Support Development
          </h4>
          
          <div className="space-y-3">
            <a
              href="https://buymeacoffee.com/developer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-secondary-container text-on-secondary-container rounded-full font-medium hover:bg-secondary-container/90 transition-all duration-225 shadow-md hover:shadow-lg active:scale-95"
            >
              <Coffee className="w-5 h-5 animate-bounce" />
              Buy me a coffee
            </a>
            
            <div className="flex gap-3">
              <a
                href="https://github.com/developer/youtube-playlist-analyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surface-container text-on-surface rounded-full font-medium hover:bg-surface-container-high transition-all duration-225 shadow-md hover:shadow-lg active:scale-95"
              >
                <Github className="w-4 h-4 transition-transform duration-225 hover:rotate-12" />
                GitHub
              </a>
              
              <a
                href="https://developer-portfolio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-all duration-225 shadow-md hover:shadow-lg active:scale-95"
              >
                <Globe className="w-4 h-4 transition-transform duration-225 hover:spin" />
                Portfolio
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-on-surface-variant">
          Made with ❤️ for the YouTube community
        </div>
      </div>
    </Modal>
  );
};