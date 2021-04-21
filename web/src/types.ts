export interface IUser {
  id: string;
  username: string;
}

export interface IPost {
  id: string;
  author: IUser;
  location?: string;
  caption?: string;
  isLiked?: boolean;
  likes_count: number;
  comments_count: number;
  last_comments?: [IComment];
  format_date: Date;
  timestamp: Date;
}

export interface IComment {
  id: string;
  author: IUser;
  content: string;
  format_date: Date;
}

export interface ILike {
  id: string;
  post: IPost;
  liker: ILike;
}

export interface IFollow {
  id: string;
  follower: IUser;
  following: IUser;
  posts: [IPost];
}
