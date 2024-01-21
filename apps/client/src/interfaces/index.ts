export interface Video {
  _id: string;
  video: IFileObject;
  thumbnail: IFileObject;
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
  likes?: number;
  likedByUser?: boolean;
}

export interface Owner {
  _id: string;
  username: string;
  fullName: string;
  avatar: IFileObject | null;
}

export interface Channel {}

export interface Comments {
  comments: Comment[];
  totalComments: number;
  nextPage: any;
  prevPage: any;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IFileObject {
  public_id: string;
  width: number;
  height: number;
  resource_type: "image" | "raw" | "video";
  url: string;
  secure_url: string;
}

export interface Comment {
  _id: string;
  content: string;
  video: string;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: IFileObject | null;
  coverImage: IFileObject | null;
  watchHistory: string[];
  password: string;
  createdAt: string;
  updatedAt: string;
  refreshToken: string;
}

export interface Channel {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  subscribersCount: number;
  channelsSubscribedToCount: number;
  isSubscribed: boolean;
}
