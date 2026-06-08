import type {
  ReadingClub,
  Discussion,
  CandidateBook,
  Review,
  CreateReadingClubInput,
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from '../../shared/types';

const API_BASE = '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `请求失败: ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  register: (data: RegisterInput): Promise<AuthResponse> =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginInput): Promise<AuthResponse> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: (): Promise<{ message: string }> =>
    request('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: (): Promise<{ user: Omit<User, 'password'> }> =>
    request('/auth/me'),
};

export const readingClubApi = {
  getAll: (): Promise<ReadingClub[]> =>
    request('/reading-clubs'),

  getById: (id: string): Promise<ReadingClub> =>
    request(`/reading-clubs/${id}`),

  create: (data: CreateReadingClubInput): Promise<ReadingClub> =>
    request('/reading-clubs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  end: (id: string): Promise<ReadingClub> =>
    request(`/reading-clubs/${id}/end`, {
      method: 'PATCH',
    }),

  addDiscussion: (
    clubId: string,
    discussion: Omit<Discussion, 'id' | 'createdAt' | 'likes' | 'userId' | 'userName' | 'readingClubId'>
  ): Promise<Discussion> =>
    request(`/reading-clubs/${clubId}/discussions`, {
      method: 'POST',
      body: JSON.stringify(discussion),
    }),

  likeDiscussion: (
    clubId: string,
    discussionId: string
  ): Promise<{ success: boolean }> =>
    request(`/reading-clubs/${clubId}/discussions/${discussionId}/like`, {
      method: 'POST',
    }),

  getReview: (id: string): Promise<Review> =>
    request(`/reading-clubs/${id}/review`),

  getCandidateBooks: (): Promise<{ books: CandidateBook[]; votedBookId: string | null }> =>
    request('/reading-clubs/candidate-books'),

  voteCandidateBook: (bookId: string): Promise<{ success: boolean; books: CandidateBook[] }> =>
    request(`/reading-clubs/candidate-books/${bookId}/vote`, {
      method: 'POST',
    }),
};
