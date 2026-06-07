import express, { type Request, type Response } from 'express';
import type {
  ReadingClub,
  Discussion,
  Review,
  CandidateBook,
  CreateReadingClubInput,
} from '../../shared/types.js';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

let mockReadingClubs: ReadingClub[] = [
  {
    id: 'rc-001',
    book: {
      id: 'book-001',
      title: '百年孤独',
      author: '加西亚·马尔克斯',
      description: '《百年孤独》是魔幻现实主义文学的代表作，描写了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰。',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=classical%20book%20cover%20design%20for%20One%20Hundred%20Years%20of%20Solitude%20magical%20realism%20style&image_size=portrait_4_3',
      totalPages: 360,
    },
    chapters: [
      {
        id: 'ch-001',
        readingClubId: 'rc-001',
        title: '第一章：马孔多的创建',
        pageRange: '第 1-45 页',
        startPage: 1,
        endPage: 45,
        deadline: '2026-06-10',
        order: 1,
      },
      {
        id: 'ch-002',
        readingClubId: 'rc-001',
        title: '第二章：家族的起源',
        pageRange: '第 46-90 页',
        startPage: 46,
        endPage: 90,
        deadline: '2026-06-17',
        order: 2,
      },
      {
        id: 'ch-003',
        readingClubId: 'rc-001',
        title: '第三章：外来者的到来',
        pageRange: '第 91-135 页',
        startPage: 91,
        endPage: 135,
        deadline: '2026-06-24',
        order: 3,
      },
    ],
    offlineEvents: [
      {
        id: 'event-001',
        readingClubId: 'rc-001',
        title: '第一次线下见面会',
        date: '2026-06-15',
        time: '19:30',
        location: '城市书房·三楼多功能厅',
        description: '讨论前两章的阅读感受，分享各自对魔幻现实主义的理解。',
        attendeeCount: 12,
      },
    ],
    discussions: [
      {
        id: 'disc-001',
        readingClubId: 'rc-001',
        chapterId: 'ch-001',
        userId: 'user-002',
        userName: '林小雨',
        type: 'comment',
        content: '第一章就被马尔克斯的叙事方式深深吸引了！那句"多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午"简直是神来之笔，一句话就包含了过去、现在和未来三个时间维度。',
        isSpoiler: false,
        createdAt: '2026-06-05T10:30:00Z',
        likes: 8,
      },
      {
        id: 'disc-002',
        readingClubId: 'rc-001',
        chapterId: 'ch-001',
        userId: 'user-003',
        userName: '张明远',
        type: 'question',
        content: '大家怎么理解吉普赛人带来的磁铁、放大镜和冰块这些意象？它们仅仅是新奇的物品，还是有更深的象征意义？',
        isSpoiler: false,
        createdAt: '2026-06-06T14:20:00Z',
        likes: 5,
      },
      {
        id: 'disc-003',
        readingClubId: 'rc-001',
        chapterId: 'ch-002',
        userId: 'user-005',
        userName: '陈浩然',
        type: 'comment',
        content: '乌尔苏拉真是这个家族的支柱！她活了那么久，见证了整个家族的兴衰。相比之下，家族里的男性们都沉浸在自己的世界里。',
        isSpoiler: true,
        createdAt: '2026-06-09T09:45:00Z',
        likes: 6,
      },
    ],
    organizerId: 'user-001',
    organizerName: '李书文',
    status: 'ongoing',
    startDate: '2026-06-01',
    endDate: null,
    memberCount: 28,
  },
  {
    id: 'rc-002',
    book: {
      id: 'book-002',
      title: '人类简史',
      author: '尤瓦尔·赫拉利',
      description: '从认知革命、农业革命到科学革命，作者用独特的视角审视人类历史。',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20design%20for%20Sapiens%20A%20Brief%20History%20of%20Humankind%20anthropology%20style&image_size=portrait_4_3',
      totalPages: 440,
    },
    chapters: [
      {
        id: 'ch-011',
        readingClubId: 'rc-002',
        title: '第一章：认知革命',
        pageRange: '第 1-70 页',
        startPage: 1,
        endPage: 70,
        deadline: '2026-05-20',
        order: 1,
      },
      {
        id: 'ch-012',
        readingClubId: 'rc-002',
        title: '第二章：农业革命',
        pageRange: '第 71-140 页',
        startPage: 71,
        endPage: 140,
        deadline: '2026-05-27',
        order: 2,
      },
    ],
    offlineEvents: [
      {
        id: 'event-003',
        readingClubId: 'rc-002',
        title: '开篇讨论会',
        date: '2026-05-18',
        time: '20:00',
        location: '线上会议室',
        description: '讨论认知革命对人类发展的意义。',
        attendeeCount: 20,
      },
    ],
    discussions: [
      {
        id: 'disc-011',
        readingClubId: 'rc-002',
        chapterId: 'ch-011',
        userId: 'user-008',
        userName: '吴晓东',
        type: 'comment',
        content: '作者说"虚构故事"让智人得以大规模合作，这个观点太有启发性了！',
        isSpoiler: false,
        createdAt: '2026-05-15T14:20:00Z',
        likes: 23,
      },
    ],
    organizerId: 'user-001',
    organizerName: '李书文',
    status: 'ended',
    startDate: '2026-05-10',
    endDate: '2026-06-20',
    memberCount: 35,
  },
];

const mockCandidateBooks: CandidateBook[] = [
  {
    id: 'cand-001',
    title: '活着',
    author: '余华',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20design%20for%20To%20Live%20by%20Yu%20Hua%20minimalist%20style&image_size=portrait_4_3',
    votes: 12,
  },
  {
    id: 'cand-002',
    title: '三体',
    author: '刘慈欣',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20design%20for%20The%20Three%20Body%20Problem%20sci%20fi%20space&image_size=portrait_4_3',
    votes: 18,
  },
  {
    id: 'cand-003',
    title: '小王子',
    author: '安托万·德·圣-埃克苏佩里',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20design%20for%20The%20Little%20Prince%20whimsical%20illustration&image_size=portrait_4_3',
    votes: 8,
  },
  {
    id: 'cand-004',
    title: '挪威的森林',
    author: '村上春树',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20design%20for%20Norwegian%20Wood%20Japanese%20literary%20style&image_size=portrait_4_3',
    votes: 15,
  },
];

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: mockReadingClubs,
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const club = mockReadingClubs.find(rc => rc.id === id);

  if (!club) {
    return res.status(404).json({
      success: false,
      error: 'Reading club not found',
    });
  }

  res.status(200).json({
    success: true,
    data: club,
  });
});

router.post('/', (req: Request, res: Response) => {
  const input: CreateReadingClubInput = req.body;
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

  mockReadingClubs = [newClub, ...mockReadingClubs];

  res.status(201).json({
    success: true,
    data: newClub,
  });
});

router.patch('/:id/end', (req: Request, res: Response) => {
  const { id } = req.params;
  const clubIndex = mockReadingClubs.findIndex(rc => rc.id === id);

  if (clubIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Reading club not found',
    });
  }

  mockReadingClubs[clubIndex] = {
    ...mockReadingClubs[clubIndex],
    status: 'ended',
    endDate: new Date().toISOString().split('T')[0],
  };

  res.status(200).json({
    success: true,
    data: mockReadingClubs[clubIndex],
  });
});

router.get('/:id/discussions', (req: Request, res: Response) => {
  const { id } = req.params;
  const club = mockReadingClubs.find(rc => rc.id === id);

  if (!club) {
    return res.status(404).json({
      success: false,
      error: 'Reading club not found',
    });
  }

  res.status(200).json({
    success: true,
    data: club.discussions,
  });
});

router.post('/:id/discussions', (req: Request, res: Response) => {
  const { id } = req.params;
  const { chapterId, type, content, isSpoiler } = req.body;
  const clubIndex = mockReadingClubs.findIndex(rc => rc.id === id);

  if (clubIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Reading club not found',
    });
  }

  const newDiscussion: Discussion = {
    id: `disc-${generateId()}`,
    readingClubId: id,
    chapterId: chapterId || null,
    userId: 'user-001',
    userName: '李书文',
    type,
    content,
    isSpoiler: isSpoiler || false,
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  mockReadingClubs[clubIndex].discussions = [
    newDiscussion,
    ...mockReadingClubs[clubIndex].discussions,
  ];

  res.status(201).json({
    success: true,
    data: newDiscussion,
  });
});

router.get('/:id/review', (req: Request, res: Response) => {
  const { id } = req.params;
  const club = mockReadingClubs.find(rc => rc.id === id);

  if (!club) {
    return res.status(404).json({
      success: false,
      error: 'Reading club not found',
    });
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
    readingClubId: id,
    totalDiscussions: club.discussions.length,
    mostDiscussedChapters: chapterDiscussionCounts,
    topDiscussions,
    candidateBooks: mockCandidateBooks,
  };

  res.status(200).json({
    success: true,
    data: review,
  });
});

router.post('/candidate-books/:bookId/vote', (req: Request, res: Response) => {
  const { bookId } = req.params;
  const bookIndex = mockCandidateBooks.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Candidate book not found',
    });
  }

  mockCandidateBooks[bookIndex].votes += 1;

  res.status(200).json({
    success: true,
    data: mockCandidateBooks[bookIndex],
  });
});

export default router;
