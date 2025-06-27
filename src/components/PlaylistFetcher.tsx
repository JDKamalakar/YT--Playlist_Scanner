import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { extractPlaylistId } from '../utils/youtube';
import { saveLastPlaylistUrl, getLastPlaylistUrl } from '../utils/storage';

interface PlaylistFetcherProps {
  onFetch: (playlistId: string) => void;
  isLoading: boolean;
}

export const PlaylistFetcher: React.FC<PlaylistFetcherProps> = ({ onFetch, isLoading }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const lastUrl = getLastPlaylistUrl();
    if (lastUrl) {
      setUrl(lastUrl);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const playlistId = extractPlaylistId(url);
    saveLastPlaylistUrl(url);
    onFetch(playlistId);
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Search className="w-5 h-5 text-teal-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Analyze Playlist</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube playlist URL or ID"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Analyze Playlist
            </>
          )}
        </button>
      </form>
    </div>
  );
};