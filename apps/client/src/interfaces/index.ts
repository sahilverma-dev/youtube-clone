export interface Video {
  _id: string;
  video: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
}

export interface Channel {}
