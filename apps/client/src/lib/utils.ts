import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years ago`;
  }

  if (interval === 1) {
    return "1 year ago";
  }

  interval = Math.floor(seconds / 2592000);

  if (interval > 1) {
    return `${interval} months ago`;
  }

  if (interval === 1) {
    return "1 month ago";
  }

  interval = Math.floor(seconds / 86400);

  if (interval > 1) {
    return `${interval} days ago`;
  }

  if (interval === 1) {
    return "1 day ago";
  }

  interval = Math.floor(seconds / 3600);

  if (interval > 1) {
    return `${interval} hours ago`;
  }

  if (interval === 1) {
    return "1 hour ago";
  }

  interval = Math.floor(seconds / 60);

  if (interval > 1) {
    return `${interval} minutes ago`;
  }

  if (interval === 1) {
    return "1 minute ago";
  }

  return "just now";
};

export const formatVideoDuration = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds) % 60;

  const formattedHours = hours > 0 ? `${hours}:` : "";
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

export const formatViewCount = (viewCount: number): string => {
  if (viewCount >= 1_000_000_000) {
    return `${(viewCount / 1_000_000_000).toFixed(1)}B views`;
  } else if (viewCount >= 1_000_000) {
    return `${(viewCount / 1_000_000).toFixed(1)}M views`;
  } else if (viewCount >= 1_000) {
    return `${(viewCount / 1_000).toFixed(1)}K views`;
  } else {
    return `${viewCount} views`;
  }
};
