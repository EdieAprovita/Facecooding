// API Error Response
export interface ApiError {
  msg: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

// Auth Types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

// Profile Types
export interface Experience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  _id: string;
  school: string;
  degree: string;
  fieldofstudy: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

export interface Social {
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

// Redux State Types
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}

export interface AlertState {
  alerts: Alert[];
}

export interface Alert {
  id: string;
  msg: string;
  alertType: 'success' | 'error' | 'warning' | 'info';
}

export interface ProfileState {
  profile: Profile | null;
  profiles: Profile[];
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

export interface PostState {
  posts: Post[];
  post: Post | null;
  loading: boolean;
  error: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  fork: boolean;
}

// API Response Types
export interface ErrorResponse {
  message: string;
  code?: string;
  errors?: ApiError[];
}

export * from "./errorCodes";

// Redux Action Payload Types
export interface AuthSuccessPayload {
  token: string;
  user?: User;
}

export interface ProfileLoadedPayload {
  profile: Profile;
}

export interface ProfilesLoadedPayload {
  profiles: Profile[];
}

export interface PostsLoadedPayload {
  posts: Post[];
}

export interface PostLoadedPayload {
  post: Post;
}

export interface CommentAddedPayload {
  postId: string;
  comment: Comment;
}

export interface LikeToggledPayload {
  postId: string;
  likes: Like[];
}

export interface Profile {
  _id: string;
  user: string;
  company?: string;
  website?: string;
  location?: string;
  status: string;
  skills: string[];
  bio?: string;
  githubusername?: string;
  experience: Experience[];
  education: Education[];
  social?: Social;
  date: string;
}

// Post Types
export interface Comment {
  _id: string;
  text: string;
  name: string;
  avatar: string;
  user: string;
  date: string;
}

export interface Like {
  user: string;
}

export interface Post {
  _id: string;
  text: string;
  name: string;
  avatar: string;
  user: string;
  likes: Like[];
  comments: Comment[];
  date: string;
}

// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password2: string;
}

export interface ProfileFormData {
  company?: string;
  website?: string;
  location?: string;
  status: string;
  skills: string;
  bio?: string;
  githubusername?: string;
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}
