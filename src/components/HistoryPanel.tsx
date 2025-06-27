import React from 'react';
import { X, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { getPlaylists, savePlaylists } from '../utils/storage';
import { StoredPlaylist } from '../types';

interface HistoryPanelProps {
  onClose: () => void;
  onPlaylistSelect: (playlistId: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onClose, onPlaylistSelect }) => {
  const [playlists, setPlaylists] = React.useState<StoredPlaylist[]>([]);

  React.useEffect(() => {
    const storedPlaylists = getPlaylists();
    // Sort by last accessed date (most recent first)
    const sortedPlaylists = storedPlaylists.sort((a, b) => 
      new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
    );
    setPlaylists(sortedPlaylists);
  }, []);

  const handlePlaylistClick = (playlistId: string) => {
    onPlaylistSelect(playlistId);
    onClose();
  };

  const handleDeletePlaylist = (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Playlist History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {playlists.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No History Yet</h3>
              <p className="text-gray-600">
                Analyzed playlists will appear here for quick access
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => handlePlaylistClick(playlist.id)}
                  className="group bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-200 cursor-pointer border border-white/20 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/120x90/e5e7eb/9ca3af?text=No+Image';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                        {playlist.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{playlist.videoCount} videos</span>
                        <span>•</span>
                        <span>{formatDate(playlist.lastAccessed)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://www.youtube.com/playlist?list=${playlist.id}`, '_blank');
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Open in YouTube"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};