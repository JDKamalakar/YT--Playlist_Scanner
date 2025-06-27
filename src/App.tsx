import React, { useState, useCallback } from 'react';
import { Video, PlaylistInfo, ViewMode, FilterMode } from './types';
import { YouTubeService } from './services/youtube';
import { decryptApiKey } from './utils/youtube';
import { getApiKey, savePlaylists, getPlaylists } from './utils/storage';
import { usePlaylistStats } from './hooks/usePlaylistStats';

import { Navbar } from './components/Navbar';
import { PlaylistFetcher } from './components/PlaylistFetcher';
import { PlaylistHeader } from './components/PlaylistHeader';
import { StatsPanel } from './components/StatsPanel';
import { ViewToggle } from './components/ViewToggle';
import { VideoGrid } from './components/VideoGrid';
import { VideoTable } from './components/VideoTable';
import { FilterControls } from './components/FilterControls';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [lastPlaylistId, setLastPlaylistId] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingPlaylistId, setPendingPlaylistId] = useState<string>('');

  const stats = usePlaylistStats(videos);

  const handleApiKeyChange = useCallback((newApiKey: string) => {
    setApiKey(newApiKey);
  }, []);

  const handleFetchPlaylist = async (playlistId: string) => {
    if (!apiKey) {
      alert('Please configure your API key first');
      return;
    }

    // Check if it's the same playlist and ask for confirmation
    if (playlistId === lastPlaylistId && videos.length > 0) {
      setPendingPlaylistId(playlistId);
      setShowConfirmation(true);
      return;
    }

    await fetchPlaylistData(playlistId);
  };

  const fetchPlaylistData = async (playlistId: string) => {
    setIsLoading(true);
    try {
      const youtubeService = new YouTubeService(apiKey);
      
      // Fetch playlist info
      const info = await youtubeService.fetchPlaylistInfo(playlistId);
      if (!info) {
        alert('Failed to fetch playlist information');
        return;
      }
      
      setPlaylistInfo(info);
      
      // Fetch videos
      const fetchedVideos = await youtubeService.fetchVideos(playlistId);
      setVideos(fetchedVideos);
      setLastPlaylistId(playlistId);
      
      // Save to storage with complete video data
      const storedPlaylists = getPlaylists();
      const existingIndex = storedPlaylists.findIndex(p => p.id === playlistId);
      
      const playlistData = {
        id: playlistId,
        title: info.title,
        thumbnail: info.thumbnail,
        lastAccessed: new Date().toISOString(),
        videoCount: fetchedVideos.length,
        videos: fetchedVideos, // Store complete video data for backup
      };
      
      if (existingIndex >= 0) {
        storedPlaylists[existingIndex] = playlistData;
      } else {
        storedPlaylists.push(playlistData);
      }
      
      savePlaylists(storedPlaylists);
      
    } catch (error) {
      console.error('Error fetching playlist:', error);
      alert('Failed to fetch playlist. Please check your API key and playlist ID.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRefetch = () => {
    fetchPlaylistData(pendingPlaylistId);
    setPendingPlaylistId('');
  };

  const handleRestoreComplete = () => {
    window.location.reload();
  };

  const handlePlaylistSelect = (playlistId: string) => {
    handleFetchPlaylist(playlistId);
  };

  // Check if API key is stored on mount
  React.useEffect(() => {
    const stored = getApiKey();
    if (stored) {
      setApiKey(decryptApiKey(stored));
    }
  }, []);

  const unavailableCount = videos.filter(v => v.unavailable).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #14b8a6 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10">
        <Navbar 
          onApiKeyChange={handleApiKeyChange}
          onRestoreComplete={handleRestoreComplete}
          onPlaylistSelect={handlePlaylistSelect}
        />
        
        <div className="container mx-auto px-4 py-8">
          {/* Playlist Fetcher */}
          <div className="mb-8">
            <PlaylistFetcher onFetch={handleFetchPlaylist} isLoading={isLoading} />
          </div>

          {playlistInfo && (
            <>
              {/* Playlist Header */}
              <div className="mb-8">
                <PlaylistHeader 
                  playlistInfo={playlistInfo} 
                  unavailableCount={unavailableCount}
                />
              </div>

              {/* Stats Panel */}
              <div className="mb-6">
                <StatsPanel stats={stats} />
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <FilterControls
                    filterMode={filterMode}
                    onFilterChange={setFilterMode}
                    unavailableCount={unavailableCount}
                    totalCount={videos.length}
                  />
                </div>
                <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              </div>

              {/* Videos Display */}
              {videos.length > 0 && (
                <div className="mb-8">
                  {viewMode === 'grid' ? (
                    <VideoGrid videos={videos} filterMode={filterMode} />
                  ) : (
                    <VideoTable videos={videos} filterMode={filterMode} />
                  )}
                </div>
              )}
            </>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Analyzing playlist...</p>
            </div>
          )}

          {/* Empty State */}
          {!playlistInfo && !isLoading && (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Ready to analyze your playlist
              </h3>
              <p className="text-gray-600">
                Enter your playlist URL above to get started with detailed analysis
              </p>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmRefetch}
          title="Refetch Playlist?"
          message="This playlist was already analyzed. Refetching will use additional API quota. Do you want to continue?"
          confirmText="Yes, Refetch"
          cancelText="Cancel"
          type="warning"
        />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </div>
  );
}

export default App;