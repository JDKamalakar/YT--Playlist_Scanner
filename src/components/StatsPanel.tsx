import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BarChart3, Clock, Video, AlertTriangle } from 'lucide-react';
import { PlaylistStats } from '../types';

interface StatsPanelProps {
  stats: PlaylistStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statItems = [
    {
      icon: Video,
      label: 'Total Videos',
      value: stats.totalVideos,
      color: 'blue',
    },
    {
      icon: BarChart3,
      label: 'Available',
      value: stats.availableVideos,
      color: 'green',
    },
    {
      icon: AlertTriangle,
      label: 'Unavailable',
      value: stats.unavailableVideos,
      color: 'red',
    },
    {
      icon: Clock,
      label: 'Total Duration',
      value: stats.totalDuration,
      color: 'purple',
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Playlist Statistics</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-4 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map((item, index) => {
              const Icon = item.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                red: 'bg-red-100 text-red-600',
                purple: 'bg-purple-100 text-purple-600',
              };

              return (
                <div
                  key={index}
                  className="bg-white/60 rounded-xl p-4 text-center backdrop-blur-sm"
                >
                  <div className={`inline-flex p-2 rounded-lg mb-2 ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              );
            })}
          </div>

          {stats.unavailableVideos > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {stats.unavailableVideos} video{stats.unavailableVideos !== 1 ? 's' : ''} unavailable
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};