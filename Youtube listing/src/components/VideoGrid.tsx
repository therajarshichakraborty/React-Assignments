import { useEffect, useState } from "react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  views: number;
  publishedAt: string;
}

export default function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
  fetch("https://api.freeapi.app/api/v1/public/youtube/videos")
    .then(res => res.json())
    .then(data => {
      setVideos(data.data.data); 
    });
}, []);
  return (
    <div className="p-6 overflow-y-auto">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ video }: any) {
  const item = video.items; // 🔥 THIS WAS MISSING
  const snippet = item?.snippet;
  const stats = item?.statistics;

  const thumbnail =
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.medium?.url;

  return (
    <div className="cursor-pointer">
      
      <img
        src={thumbnail}
        alt={snippet?.title}
        className="rounded-xl w-full h-44 object-cover"
      />

      <div className="mt-3">
        <h3 className="text-sm font-semibold line-clamp-2">
          {snippet?.title}
        </h3>

        <p className="text-gray-400 text-xs mt-1">
          {snippet?.channelTitle}
        </p>

        <p className="text-gray-500 text-xs">
          {formatViews(stats?.viewCount)} views • {timeAgo(snippet?.publishedAt)}
        </p>
      </div>
    </div>
  );
}

function formatViews(views: string) {
  if (!views) return "0";

  const num = Number(views);

  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";

  return num.toString();
}

function timeAgo(date: string) {
  if (!date) return "recently";

  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (isNaN(days)) return "recently";
  if (days < 1) return "Today";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

  return `${Math.floor(days / 30)} months ago`;
}