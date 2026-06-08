import type { User, ReadingClub, CandidateBook } from '../../shared/types';
import { generateId } from '../utils/helpers.js';
import bcrypt from 'bcrypt';

interface MemoryStore {
  users: Map<string, User>;
  readingClubs: Map<string, ReadingClub>;
  candidateBooks: Map<string, CandidateBook>;
  userVotes: Map<string, string>;
}

const store: MemoryStore = {
  users: new Map(),
  readingClubs: new Map(),
  candidateBooks: new Map(),
  userVotes: new Map(),
};

async function initMockData() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const organizer: User = {
    id: 'user-001',
    name: '李书文',
    email: 'organizer@example.com',
    password: hashedPassword,
    role: 'organizer',
    createdAt: new Date().toISOString(),
  };
  
  const member: User = {
    id: 'user-002',
    name: '张读书',
    email: 'member@example.com',
    password: hashedPassword,
    role: 'member',
    createdAt: new Date().toISOString(),
  };
  
  store.users.set(organizer.id, organizer);
  store.users.set(member.id, member);
  
  const mockReadingClubs: ReadingClub[] = [
    {
      id: 'club-001',
      book: {
        id: 'book-100',
        title: '百年孤独',
        author: '加西亚·马尔克斯',
        description: '魔幻现实主义的巅峰之作，布恩迪亚家族七代人的传奇故事。',
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vintage%20book%20cover%20of%20One%20Hundred%20Years%20of%20Solitude%20with%20butterflies&image_size=square_hd',
        totalPages: 360,
      },
      organizerId: 'user-001',
      organizerName: '李书文',
      chapters: [
        { id: 'ch-1', readingClubId: 'club-001', title: '初识马孔多', pageRange: '第 1-80 页', startPage: 1, endPage: 80, deadline: '2024-01-13', order: 1 },
        { id: 'ch-2', readingClubId: 'club-001', title: '吉普赛人来访', pageRange: '第 81-160 页', startPage: 81, endPage: 160, deadline: '2024-01-20', order: 2 },
        { id: 'ch-3', readingClubId: 'club-001', title: '羊皮卷之谜', pageRange: '第 161-240 页', startPage: 161, endPage: 240, deadline: '2024-01-27', order: 3 },
      ],
      discussions: [
        {
          id: 'disc-001',
          readingClubId: 'club-001',
          chapterId: 'ch-1',
          userId: 'user-002',
          userName: '张读书',
          type: 'comment',
          content: '第一章的叙述太令人震撼了，马尔克斯的开篇无人能及。',
          createdAt: '2024-01-08T10:30:00Z',
          likes: 3,
          isSpoiler: false,
        },
        {
          id: 'disc-002',
          readingClubId: 'club-001',
          chapterId: 'ch-1',
          userId: 'user-002',
          userName: '张读书',
          type: 'question',
          content: '为什么布恩迪亚家族的男性都叫何塞·阿卡迪奥和奥雷里亚诺？这有什么象征意义吗？',
          createdAt: '2024-01-09T14:15:00Z',
          likes: 2,
          isSpoiler: false,
        },
        {
          id: 'disc-003',
          readingClubId: 'club-001',
          chapterId: 'ch-2',
          userId: 'user-001',
          userName: '李书文',
          type: 'excerpt',
          content: '"多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。"——这是文学史上最伟大的开头之一！',
          createdAt: '2024-01-15T09:20:00Z',
          likes: 5,
          isSpoiler: false,
        },
        {
          id: 'disc-004',
          readingClubId: 'club-001',
          chapterId: 'ch-3',
          userId: 'user-001',
          userName: '李书文',
          type: 'comment',
          content: '羊皮卷的预言居然精准预示了整个家族的命运，最后一章的揭示太震撼了！',
          createdAt: '2024-01-22T16:45:00Z',
          likes: 4,
          isSpoiler: true,
        },
      ],
      offlineEvents: [
        { id: 'meet-001', readingClubId: 'club-001', title: '第一章讨论与分享会', date: '2024-01-14', time: '14:00', location: '城市书房·二楼会议室', description: '分享第一章的阅读感受', attendeeCount: 8 },
        { id: 'meet-002', readingClubId: 'club-001', title: '前三章回顾与主题探讨', date: '2024-01-28', time: '14:00', location: '城市书房·二楼会议室', description: '回顾前三章内容，探讨魔幻现实主义', attendeeCount: 10 },
      ],
      status: 'ongoing',
      startDate: '2024-01-01',
      endDate: null,
      memberCount: 12,
    },
    {
      id: 'club-002',
      book: {
        id: 'book-101',
        title: '活着',
        author: '余华',
        description: '讲述一个人和他命运之间的友情，讲述人如何去承受巨大的苦难。',
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vintage%20book%20cover%20of%20To%20Live%20by%20Yu%20Hua%20with%20an%20old%20man%20and%20a%20cow&image_size=square_hd',
        totalPages: 200,
      },
      organizerId: 'user-001',
      organizerName: '李书文',
      chapters: [
        { id: 'ch-1', readingClubId: 'club-002', title: '地主少爷', pageRange: '第 1-50 页', startPage: 1, endPage: 50, deadline: '2024-02-07', order: 1 },
        { id: 'ch-2', readingClubId: 'club-002', title: '家道中落', pageRange: '第 51-100 页', startPage: 51, endPage: 100, deadline: '2024-02-14', order: 2 },
        { id: 'ch-3', readingClubId: 'club-002', title: '战乱年代', pageRange: '第 101-150 页', startPage: 101, endPage: 150, deadline: '2024-02-21', order: 3 },
        { id: 'ch-4', readingClubId: 'club-002', title: '生死离别', pageRange: '第 151-200 页', startPage: 151, endPage: 200, deadline: '2024-02-28', order: 4 },
      ],
      discussions: [
        {
          id: 'disc-005',
          readingClubId: 'club-002',
          chapterId: 'ch-1',
          userId: 'user-002',
          userName: '张读书',
          type: 'comment',
          content: '福贵的前半生真是让人又恨又怜，余华的描写太真实了。',
          createdAt: '2024-02-02T11:00:00Z',
          likes: 2,
          isSpoiler: false,
        },
      ],
      offlineEvents: [
        { id: 'meet-003', readingClubId: 'club-002', title: '《活着》主题讨论会', date: '2024-02-14', time: '14:00', location: '城市书房·二楼会议室', description: '深度探讨《活着》的主题', attendeeCount: 6 },
      ],
      status: 'ongoing',
      startDate: '2024-01-25',
      endDate: null,
      memberCount: 8,
    },
  ];
  
  const mockCandidateBooks: CandidateBook[] = [
    {
      id: 'book-001',
      title: '霍乱时期的爱情',
      author: '加西亚·马尔克斯',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=romantic%20book%20cover%20of%20Love%20in%20the%20Time%20of%20Cholera%20with%20vintage%20style&image_size=square_hd',
      description: '跨越半个多世纪的爱情史诗，诠释了所有爱情的可能性。',
      votes: 8,
    },
    {
      id: 'book-002',
      title: '平凡的世界',
      author: '路遥',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20rural%20landscape%20book%20cover%20for%20Ordinary%20World&image_size=square_hd',
      description: '一部伟大的史诗，记录中国70-80年代城乡社会生活。',
      votes: 6,
    },
    {
      id: 'book-003',
      title: '1984',
      author: '乔治·奥威尔',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dystopian%20book%20cover%20of%201984%20with%20big%20brother%20theme&image_size=square_hd',
      description: '反乌托邦文学的经典，预言了极权主义的恐怖。',
      votes: 5,
    },
    {
      id: 'book-004',
      title: '围城',
      author: '钱钟书',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=classic%20chinese%20book%20cover%20of%20Fortress%20Besieged&image_size=square_hd',
      description: '婚姻是围城，城外的人想进去，城里的人想出来。',
      votes: 4,
    },
  ];
  
  mockReadingClubs.forEach(club => {
    store.readingClubs.set(club.id, club);
  });
  
  mockCandidateBooks.forEach(book => {
    store.candidateBooks.set(book.id, book);
  });
}

initMockData();

export function findUserByEmail(email: string): User | undefined {
  return Array.from(store.users.values()).find(u => u.email === email);
}

export function findUserById(id: string): User | undefined {
  return store.users.get(id);
}

export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const id = `user-${generateId()}`;
  const user: User = {
    ...userData,
    id,
    createdAt: new Date().toISOString(),
  };
  store.users.set(id, user);
  return user;
}

export function getAllReadingClubs(): ReadingClub[] {
  return Array.from(store.readingClubs.values());
}

export function getReadingClubById(id: string): ReadingClub | undefined {
  return store.readingClubs.get(id);
}

export function createReadingClub(club: ReadingClub): ReadingClub {
  store.readingClubs.set(club.id, club);
  return club;
}

export function updateReadingClub(id: string, updates: Partial<ReadingClub>): ReadingClub | undefined {
  const club = store.readingClubs.get(id);
  if (!club) return undefined;
  const updated = { ...club, ...updates };
  store.readingClubs.set(id, updated);
  return updated;
}

export function addDiscussionToClub(
  clubId: string,
  discussion: ReadingClub['discussions'][0]
): ReadingClub | undefined {
  const club = store.readingClubs.get(clubId);
  if (!club) return undefined;
  club.discussions = [discussion, ...club.discussions];
  return club;
}

export function likeDiscussion(
  clubId: string,
  discussionId: string
): ReadingClub | undefined {
  const club = store.readingClubs.get(clubId);
  if (!club) return undefined;
  const discussion = club.discussions.find(d => d.id === discussionId);
  if (discussion) {
    discussion.likes += 1;
  }
  return club;
}

export function getAllCandidateBooks(): CandidateBook[] {
  return Array.from(store.candidateBooks.values());
}

export function voteCandidateBook(bookId: string, userId: string): boolean {
  if (store.userVotes.has(userId)) {
    return false;
  }
  const book = store.candidateBooks.get(bookId);
  if (!book) return false;
  book.votes += 1;
  store.userVotes.set(userId, bookId);
  return true;
}

export function hasUserVoted(userId: string): boolean {
  return store.userVotes.has(userId);
}

export function getUserVotedBook(userId: string): string | undefined {
  return store.userVotes.get(userId);
}
