export interface Video {
  _id: string;
  video: string;
  thumbnail: string;
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
  avatar: string;
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
  avatar: string;
  coverImage: string;
  watchHistory: string[];
  password: string;
  createdAt: string;
  updatedAt: string;
  refreshToken: string;
}
