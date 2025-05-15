export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}