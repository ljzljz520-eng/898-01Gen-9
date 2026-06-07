import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ReadingClub,
  Discussion,
  CandidateBook,
  Review,
  CreateReadingClubInput,
} from '../../shared/types';
import { mockReadingClubs, mockCandidateBooks } from '../utils/mockData';
import { generateId } from '../utils/helpers';

interface ReadingClubState {
  readingClubs: ReadingClub[];
  candidateBooks: CandidateBook[];
  currentUser: { id: string; name: string };
  isLoading: boolean;
  
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
}

export const useReadingClubStore = create<ReadingClubState>()(
  persist(
    (set, get) => ({
      readingClubs: [],
      candidateBooks: [],
      currentUser: { id: 'user-001', name: '李书文' },
      isLoading: false,

      fetchReadingClubs: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        const { readingClubs } = get();
        if (readingClubs.length === 0) {
          set({ readingClubs: mockReadingClubs, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      fetchReadingClubById: async (id: string) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        const { readingClubs } = get();
        const club = readingClubs.find(rc => rc.id === id);
        set({ isLoading: false });
        return club;
      },

      createReadingClub: async (input) => {
        const newId = `rc-${generateId()}`;
        const newClub: ReadingClub = {
          id: newId,
          book: {
            ...input.book,
            id: `book-${generateId()}`,
          },
          chapters: input.chapters.map((ch, idx) => ({
            ...ch,
            id: `ch-${generateId()}`,
            readingClubId: newId,
            order: idx + 1,
          })),
          offlineEvents: input.offlineEvents.map(event => ({
            ...event,
            id: `event-${generateId()}`,
            readingClubId: newId,
          })),
          discussions: [],
          organizerId: input.organizerId,
          organizerName: input.organizerName,
          status: 'ongoing',
          startDate: new Date().toISOString().split('T')[0],
          endDate: null,
          memberCount: 1,
        };

        set(state => ({
          readingClubs: [newClub, ...state.readingClubs],
        }));

        return newClub;
      },

      addDiscussion: async (readingClubId, discussion) => {
        const { currentUser } = get();
        const newDiscussion: Discussion = {
          ...discussion,
          id: `disc-${generateId()}`,
          readingClubId,
          createdAt: new Date().toISOString(),
          likes: 0,
          userId: currentUser.id,
          userName: currentUser.name,
        };

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
        }));

        return newDiscussion;
      },

      likeDiscussion: async (readingClubId, discussionId) => {
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
      },

      endReadingClub: async (id: string) => {
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
        }));
      },

      fetchReview: async (readingClubId: string) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { readingClubs } = get();
        const club = readingClubs.find(rc => rc.id === readingClubId);
        
        if (!club) {
          set({ isLoading: false });
          return null;
        }

        const chapterDiscussionCounts = club.chapters.map(chapter => ({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          count: club.discussions.filter(d => d.chapterId === chapter.id).length,
        })).sort((a, b) => b.count - a.count);

        const topDiscussions = [...club.discussions]
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 5);

        const review: Review = {
          readingClubId,
          totalDiscussions: club.discussions.length,
          mostDiscussedChapters: chapterDiscussionCounts,
          topDiscussions,
          candidateBooks: get().candidateBooks,
        };

        set({ isLoading: false });
        return review;
      },

      voteCandidateBook: async (bookId: string) => {
        set(state => ({
          candidateBooks: state.candidateBooks.map(book => {
            if (book.id === bookId) {
              return { ...book, votes: book.votes + 1 };
            }
            return book;
          }),
        }));
      },

      fetchCandidateBooks: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        const { candidateBooks } = get();
        if (candidateBooks.length === 0) {
          set({ candidateBooks: mockCandidateBooks, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'reading-club-storage',
      partialize: (state) => ({
        readingClubs: state.readingClubs,
        candidateBooks: state.candidateBooks,
      }),
    }
  )
);
