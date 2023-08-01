export interface AuthState {
  id: number;
  name: string;
  avatar: string;
}

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
}
