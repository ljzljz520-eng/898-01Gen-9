import { create } from 'zustand';
import type {
  ReadingClub,
  Discussion,
  CandidateBook,
  Review,
  CreateReadingClubInput,
} from '../../shared/types';
import { readingClubApi } from '../lib/api';

interface ReadingClubState {
  readingClubs: ReadingClub[];
  candidateBooks: CandidateBook[];
  votedBookId: string | null;
  isLoading: boolean;
  error: string | null;
  
  fetchReadingClubs: () => Promise<void>;
  fetchReadingClubById: (id: string) => Promise<ReadingClub | undefined>;
  createReadingClub: (input: CreateReadingClubInput) => Promise<ReadingClub>;
  addDiscussion: (
    readingClubId: string,
    discussion: Omit<Discussion, 'id' | 'createdAt' | 'likes' | 'userId' | 'userName' | 'readingClubId'>
  ) => Promise<Discussion>;
  likeDiscussion: (readingClubId: string, discussionId: string) => Promise<void>;
  endReadingClub: (id: string) => Promise<void>;
  fetchReview: (readingClubId: string) => Promise<Review | null>;
  voteCandidateBook: (bookId: string) => Promise<void>;
  fetchCandidateBooks: () => Promise<void>;
  clearError: () => void;
}

export const useReadingClubStore = create<ReadingClubState>((set, get) => ({
  readingClubs: [],
  candidateBooks: [],
  votedBookId: null,
  isLoading: false,
  error: null,

  fetchReadingClubs: async () => {
    set({ isLoading: true, error: null });
    try {
      const clubs = await readingClubApi.getAll();
      set({ readingClubs: clubs, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取读书会列表失败',
        isLoading: false,
      });
    }
  },

  fetchReadingClubById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const club = await readingClubApi.getById(id);
      set(state => ({
        readingClubs: state.readingClubs.map(rc => rc.id === id ? club : rc),
        isLoading: false,
      }));
      return club;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取读书会详情失败',
        isLoading: false,
      });
      return undefined;
    }
  },

  createReadingClub: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const newClub = await readingClubApi.create(input);
      set(state => ({
        readingClubs: [newClub, ...state.readingClubs],
        isLoading: false,
      }));
      return newClub;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '创建读书会失败',
        isLoading: false,
      });
      throw error;
    }
  },

  addDiscussion: async (readingClubId, discussion) => {
    set({ isLoading: true, error: null });
    try {
      const newDiscussion = await readingClubApi.addDiscussion(readingClubId, discussion);
      set(state => ({
        readingClubs: state.readingClubs.map(rc => {
          if (rc.id === readingClubId) {
            return {
              ...rc,
              discussions: [newDiscussion, ...rc.discussions],
            };
          }
          return rc;
        }),
        isLoading: false,
      }));
      return newDiscussion;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '发布讨论失败',
        isLoading: false,
      });
      throw error;
    }
  },

  likeDiscussion: async (readingClubId, discussionId) => {
    set({ error: null });
    try {
      await readingClubApi.likeDiscussion(readingClubId, discussionId);
      set(state => ({
        readingClubs: state.readingClubs.map(rc => {
          if (rc.id === readingClubId) {
            return {
              ...rc,
              discussions: rc.discussions.map(d => {
                if (d.id === discussionId) {
                  return { ...d, likes: d.likes + 1 };
                }
                return d;
              }),
            };
          }
          return rc;
        }),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '点赞失败',
      });
    }
  },

  endReadingClub: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await readingClubApi.end(id);
      set(state => ({
        readingClubs: state.readingClubs.map(rc => {
          if (rc.id === id) {
            return {
              ...rc,
              status: 'ended',
              endDate: new Date().toISOString().split('T')[0],
            };
          }
          return rc;
        }),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '结束共读失败',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchReview: async (readingClubId) => {
    set({ isLoading: true, error: null });
    try {
      const review = await readingClubApi.getReview(readingClubId);
      set({ isLoading: false });
      return review;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取回顾数据失败',
        isLoading: false,
      });
      return null;
    }
  },

  voteCandidateBook: async (bookId) => {
    set({ error: null });
    try {
      const result = await readingClubApi.voteCandidateBook(bookId);
      set({
        candidateBooks: result.books,
        votedBookId: bookId,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '投票失败',
      });
      throw error;
    }
  },

  fetchCandidateBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await readingClubApi.getCandidateBooks();
      set({
        candidateBooks: result.books,
        votedBookId: result.votedBookId,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取候选书籍失败',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
