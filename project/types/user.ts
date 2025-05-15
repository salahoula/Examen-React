export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  booksRead?: number;
  booksOwned?: number;
  reviews?: number;
  createdAt?: string;
}