import React, { useState } from 'react';
import { Video, FilterMode } from '../types';
import { getVideoUrl } from '../utils/youtube';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, AlertTriangle } from 'lucide-react';

interface VideoTableProps {
  videos: Video[];
  filterMode?: FilterMode;
}

type SortField = 'index' | 'title' | 'duration';
type SortDirection = 'asc' | 'desc';

export const VideoTable: React.FC<VideoTableProps> = ({ videos, filterMode = 'all' }) => {
  const [sortField, setSortField] = useState<SortField>('index');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'index') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (sortField === 'duration') {
      // Convert duration to seconds for sorting
      const parseTime = (time: string) => {
        if (time === 'Unavailable') return 0;
        const parts = time.split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
      };
      aValue = parseTime(aValue);
      bValue = parseTime(bValue);
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-primary" /> : 
      <ArrowDown className="w-4 h-4 text-primary" />;
  };

  const handleVideoClick = (videoId: string) => {
    window.open(getVideoUrl(videoId), '_blank');
  };

  return (
    <div className="bg-surface rounded-3xl shadow-lg border border-outline-variant overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-container">
            <tr>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-all duration-225 select-none"
                onClick={() => handleSort('index')}
              >
                <div className="flex items-center gap-2">
                  #
                  {getSortIcon('index')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                Thumbnail
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-all duration-225 select-none"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  Title
                  {getSortIcon('title')}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-all duration-225 select-none"
                onClick={() => handleSort('duration')}
              >
                <div className="flex items-center gap-2">
                  Duration
                  {getSortIcon('duration')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {sortedVideos.map((video, index) => (
              <tr
                key={video.id}
                className={`hover:bg-surface-container-low transition-all duration-225 ${
                  video.unavailable ? 'opacity-60' : ''
                } ${index % 2 === 0 ? 'bg-surface' : 'bg-surface-container-lowest'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-container text-on-primary-container rounded-full text-sm font-medium">
                    {video.index}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative group">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-32 h-20 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-225 shadow-md hover:shadow-lg"
                      onClick={() => handleVideoClick(video.videoId)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/120x90/e5e7eb/9ca3af?text=Unavailable';
                      }}
                    />
                    {video.unavailable && (
                      <div className="absolute -top-2 -right-2 bg-error text-on-error rounded-full p-1 shadow-md">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 rounded-xl transition-all duration-225 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface max-w-xs">
                  <div
                    className={`cursor-pointer hover:text-primary transition-colors duration-225 line-clamp-2 ${
                      video.unavailable ? 'text-on-surface-variant' : ''
                    }`}
                    onClick={() => handleVideoClick(video.videoId)}
                    title={video.title}
                  >
                    {video.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    video.duration === 'Unavailable' 
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-surface-container text-on-surface'
                  }`}>
                    {video.duration}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleVideoClick(video.videoId)}
                    className="p-2 text-primary hover:bg-primary-container rounded-full transition-all duration-225 hover:scale-110 active:scale-95"
                    title="Open video"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};