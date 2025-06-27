import React from 'react';
import { Video, FilterMode } from '../types';
import { getVideoUrl } from '../utils/youtube';
import { Play, Clock, AlertTriangle } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  filterMode?: FilterMode;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, filterMode = 'all' }) => {
  const filteredVideos = videos.filter(video => {
    switch (filterMode) {
      case 'available':
        return !video.unavailable;
      case 'unavailable':
        return video.unavailable;
      default:
        return true;
    }
  });

  const handleVideoClick = (videoId: string) => {
    window.open(getVideoUrl(videoId), '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredVideos.map((video) => (
        <div
          key={video.id}
          className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
              onClick={() => handleVideoClick(video.videoId)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/320x180/e5e7eb/9ca3af?text=Video+Unavailable';
              }}
            />
            
            {/* Play overlay */}
            <div
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
              onClick={() => handleVideoClick(video.videoId)}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>

            {/* Unavailable badge */}
            {video.unavailable && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Unavailable
              </div>
            )}

            {/* Video index */}
            <div className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-lg font-medium">
              #{video.index}
            </div>
          </div>

          <div className="p-4">
            <h3
              className={`font-medium line-clamp-2 text-sm cursor-pointer hover:text-blue-600 transition-colors ${
                video.unavailable ? 'text-gray-500' : 'text-gray-800'
              }`}
              onClick={() => handleVideoClick(video.videoId)}
              title={video.title}
            >
              {video.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};