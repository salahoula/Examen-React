import { Book } from '@/types/book';
import { User } from '@/types/user';

// Base URL for API - typically from environment variables
const API_URL = 'http://192.168.1.17:8080/api/books';


class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RetryConfig = {
  url: string;
  options?: RequestInit;
};

// Utility: Simulate delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Handles API request errors and provides consistent error handling
 */
const handleApiError = (error: any) => {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    throw error;
  }

  const errorMessage = error.response?.data?.message
    || error.message
    || 'An unexpected error occurred. Please try again later.';

  const status = error.response?.status || 500;

  if (status === 500) {
    return retryRequest({ url: error.config?.url, options: error.config?.options });
  }

  throw new ApiError(errorMessage, status);
};

/**
 * Implements exponential backoff for failed requests
 */
const retryRequest = async (config: RetryConfig, retries = 3, delay = 1000) => {
  try {
    await wait(delay);
    return await fetchApi(config.url, config.options);
  } catch (error) {
    if (retries === 1) {
      throw new ApiError('Service temporarily unavailable', 503);
    }
    return retryRequest(config, retries - 1, delay * 2);
  }
};

/**
 * Generic fetch function with error handling and retry logic
 */
const fetchApi = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    await wait(500); // simulate delay

    if (Math.random() < 0.1) {
      throw new ApiError('Internal Server Error', 500, 'INTERNAL_ERROR');
    }

    if (endpoint === '/books') {
      return mockBooks as T;
    } else if (endpoint.startsWith('/books/') && endpoint.split('/').length === 3) {
      const id = parseInt(endpoint.split('/')[2]);
      const book = mockBooks.find(b => b.id === id);
      if (!book) throw new ApiError('Book not found', 404, 'NOT_FOUND');
      return book as T;
    } else if (endpoint === '/profile') {
      return mockUser as T;
    } else if (endpoint.startsWith('/books/search')) {
      const query = endpoint.split('=')[1]?.toLowerCase();
      const results = mockBooks.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
      );
      return results as T;
    }

    throw new ApiError('Not Found', 404, 'NOT_FOUND');
  } catch (error) {
    return handleApiError(error);
  }
};

// API: Book functions
export const fetchBooks = async (): Promise<Book[]> => {
  return fetchApi('/books');
};

export const fetchBookById = async (id: number): Promise<Book> => {
  return fetchApi(`/books/${id}`);
};

export const addBook = async (bookData: Omit<Book, 'id'>): Promise<Book> => {
  await wait(800);

  if (Math.random() < 0.1) {
    throw new ApiError('Invalid book data', 400, 'VALIDATION_ERROR');
  }

  return {
    id: Date.now(),
    ...bookData,
    createdAt: new Date().toISOString(),
  };
};

export const updateBook = async (id: number, bookData: Partial<Book>): Promise<Book> => {
  await wait(800);

  const book = mockBooks.find(book => book.id === id);
  if (!book) {
    throw new ApiError('Book not found', 404, 'NOT_FOUND');
  }

  return {
    ...book,
    ...bookData,
    id,
    updatedAt: new Date().toISOString(),
  };
};

export const deleteBook = async (id: number): Promise<void> => {
  await wait(600);

  const book = mockBooks.find(book => book.id === id);
  if (!book) {
    throw new ApiError('Book not found', 404, 'NOT_FOUND');
  }
};

// API: User functions
type AuthResponse = {
  token: string;
  user: User;
};

export const getUserProfile = async (): Promise<User> => {
  return fetchApi('/profile');
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  await wait(1000);

  if (Math.random() < 0.15) {
    throw new ApiError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  return {
    token: 'mock_token_xyz',
    user: mockUser,
  };
};

export const register = async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
  await wait(1200);

  if (Math.random() < 0.1) {
    throw new ApiError('Email already exists', 400, 'EMAIL_EXISTS');
  }

  return {
    token: 'mock_token_xyz',
    user: { ...mockUser, name: userData.name, email: userData.email },
  };
};

export const logout = async (): Promise<void> => {
  await wait(500);
};

// -------------------------
// Mock Data
// -------------------------
const mockBooks: Book[] = [
  {
    id: 1,
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    description: 'A haunting tale of a dystopian future where totalitarianism reigns and truth is subjective.',
    coverUrl: 'https://images.pexels.com/photos/1005324/pexels-photo-1005324.jpeg',
    status: 'Available',
    createdAt: '2023-06-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    description: 'A classic novel about love and social standing, following Elizabeth Bennet and Mr. Darcy.',
    coverUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg',
    status: 'Borrowed',
    createdAt: '2023-06-16T11:00:00Z',
  },
  {
    id: 3,
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-help',
    description: 'An insightful guide on how small changes can lead to remarkable results over time.',
    coverUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg',
    status: 'Available',
    createdAt: '2023-06-17T12:00:00Z',
  },
  {
    id: 4,
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Science Fiction',
    description: 'Set in a distant future, Dune tells the story of Paul Atreides and the struggle for control of a desert planet.',
    coverUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg',
    status: 'Available',
    createdAt: '2023-06-18T13:00:00Z',
  },
];

const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg',
  booksRead: 12,
  booksOwned: 24,
  reviews: 8,
  createdAt: '2023-01-01T00:00:00Z',
};
