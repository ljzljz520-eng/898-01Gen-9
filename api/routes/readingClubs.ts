import { Router, type Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllReadingClubs,
  getReadingClubById,
  createReadingClub as storeCreateReadingClub,
  updateReadingClub,
  addDiscussionToClub,
  likeDiscussion as storeLikeDiscussion,
  getAllCandidateBooks,
  voteCandidateBook,
  hasUserVoted,
  getUserVotedBook,
} from '../store/memoryStore.js';
import { generateId } from '../utils/helpers.js';
import type {
  ReadingClub,
  Discussion,
  CreateReadingClubInput,
  Review,
} from '../../shared/types.js';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const clubs = getAllReadingClubs();
    res.json(clubs);
  } catch (error) {
    console.error('Get reading clubs error:', error);
    res.status(500).json({ error: '获取读书会列表失败' });
  }
});

router.get('/candidate-books', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const books = getAllCandidateBooks();
    let votedBookId: string | null = null;
    
    if (req.user) {
      if (hasUserVoted(req.user.id)) {
        votedBookId = getUserVotedBook(req.user.id) || null;
      }
    }
    
    res.json({ books, votedBookId });
  } catch (error) {
    console.error('Get candidate books error:', error);
    res.status(500).json({ error: '获取候选书籍失败' });
  }
});

router.post('/candidate-books/:bookId/vote', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '请先登录' });
      return;
    }

    const { bookId } = req.params;
    
    const success = voteCandidateBook(bookId, req.user.id);
    
    if (!success) {
      res.status(400).json({ error: '您已经投过票了' });
      return;
    }

    res.json({ success: true, books: getAllCandidateBooks() });
  } catch (error) {
    console.error('Vote candidate book error:', error);
    res.status(500).json({ error: '投票失败' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const club = getReadingClubById(id);
    
    if (!club) {
      res.status(404).json({ error: '读书会不存在' });
      return;
    }
    
    res.json(club);
  } catch (error) {
    console.error('Get reading club error:', error);
    res.status(500).json({ error: '获取读书会详情失败' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '请先登录' });
      return;
    }

    const input = req.body as CreateReadingClubInput;
    
    if (!input.book.title || !input.chapters || input.chapters.length === 0) {
      res.status(400).json({ error: '请填写完整信息' });
      return;
    }

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
      organizerId: req.user.id,
      organizerName: req.user.name,
      status: 'ongoing',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      memberCount: 1,
    };

    const createdClub = storeCreateReadingClub(newClub);
    res.status(201).json(createdClub);
  } catch (error) {
    console.error('Create reading club error:', error);
    res.status(500).json({ error: '创建读书会失败' });
  }
});

router.patch('/:id/end', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '请先登录' });
      return;
    }

    const { id } = req.params;
    const club = getReadingClubById(id);
    
    if (!club) {
      res.status(404).json({ error: '读书会不存在' });
      return;
    }

    if (club.organizerId !== req.user.id) {
      res.status(403).json({ error: '只有组织者可以结束共读' });
      return;
    }

    const updatedClub = updateReadingClub(id, {
      status: 'ended',
      endDate: new Date().toISOString().split('T')[0],
    });

    res.json(updatedClub);
  } catch (error) {
    console.error('End reading club error:', error);
    res.status(500).json({ error: '结束共读失败' });
  }
});

router.get('/:id/discussions', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const club = getReadingClubById(id);
    
    if (!club) {
      res.status(404).json({ error: '读书会不存在' });
      return;
    }
    
    res.json(club.discussions);
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: '获取讨论列表失败' });
  }
});

router.post('/:id/discussions', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '请先登录' });
      return;
    }

    const { id } = req.params;
    const club = getReadingClubById(id);
    
    if (!club) {
      res.status(404).json({ error: '读书会不存在' });
      return;
    }

    const { chapterId, type, content, isSpoiler } = req.body;

    if (!content) {
      res.status(400).json({ error: '讨论内容不能为空' });
      return;
    }

    const newDiscussion: Discussion = {
      id: `disc-${generateId()}`,
      readingClubId: id,
      chapterId: chapterId || null,
      userId: req.user.id,
      userName: req.user.name,
      type,
      content,
      isSpoiler: isSpoiler || false,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    const updatedClub = addDiscussionToClub(id, newDiscussion);
    if (!updatedClub) {
      res.status(500).json({ error: '发布讨论失败' });
      return;
    }

    res.status(201).json(newDiscussion);
  } catch (error) {
    console.error('Add discussion error:', error);
    res.status(500).json({ error: '发布讨论失败' });
  }
});

router.post('/:id/discussions/:discussionId/like', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '请先登录' });
      return;
    }

    const { id, discussionId } = req.params;
    const club = getReadingClubById(id);
    
    if (!club) {
      res.status(404).json({ error: '读书会不存在' });
      return;
    }

    const updatedClub = storeLikeDiscussion(id, discussionId);
    if (!updatedClub) {
      res.status(500).json({ error: '点赞失败' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Like discussion error:', error);
    res.status(500).json({ error: '点赞失败' });
  }
});

router.get('/:id/review', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const club = getReadingClubById(id);
    
    if (!club) {
      res.status(404).json({ error: '读书会不存在' });
      return;
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
      candidateBooks: getAllCandidateBooks(),
    };

    res.json(review);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ error: '获取回顾数据失败' });
  }
});

export default router;
