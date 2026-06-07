export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  totalPages: number;
}

export interface Chapter {
  id: string;
  readingClubId: string;
  title: string;
  pageRange: string;
  startPage: number;
  endPage: number;
  deadline: string;
  order: number;
}

export interface Discussion {
  id: string;
  readingClubId: string;
  chapterId: string | null;
  userId: string;
  userName: string;
  type: 'comment' | 'question' | 'excerpt';
  content: string;
  isSpoiler: boolean;
  createdAt: string;
  likes: number;
}

export interface OfflineEvent {
  id: string;
  readingClubId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendeeCount: number;
}

export interface ReadingClub {
  id: string;
  book: Book;
  chapters: Chapter[];
  offlineEvents: OfflineEvent[];
  discussions: Discussion[];
  organizerId: string;
  organizerName: string;
  status: 'ongoing' | 'ended';
  startDate: string;
  endDate: string | null;
  memberCount: number;
}

export interface Review {
  readingClubId: string;
  totalDiscussions: number;
  mostDiscussedChapters: { chapterId: string; chapterTitle: string; count: number }[];
  topDiscussions: Discussion[];
  candidateBooks: CandidateBook[];
}

export interface CandidateBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  votes: number;
}

export interface CreateReadingClubInput {
  book: Omit<Book, 'id'>;
  chapters: Omit<Chapter, 'id' | 'readingClubId'>[];
  offlineEvents: Omit<OfflineEvent, 'id' | 'readingClubId'>[];
  organizerId: string;
  organizerName: string;
}

export type DiscussionType = 'comment' | 'question' | 'excerpt' | 'all';
