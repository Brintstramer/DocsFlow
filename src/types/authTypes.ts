export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthRequest {
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
