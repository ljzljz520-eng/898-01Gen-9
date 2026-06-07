import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  MessageCircle,
  Users,
  Calendar,
  TrendingUp,
  Award,
  ThumbsUp,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { useReadingClubStore } from '../store/useReadingClubStore';
import type { Review as ReviewType, CandidateBook } from '../../shared/types';
import SpoilerBlock from '../components/SpoilerBlock';
import { formatDate, getTypeLabel } from '../utils/helpers';

export default function Review() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    readingClubs,
    isLoading,
    fetchReview,
    fetchCandidateBooks,
    voteCandidateBook,
    fetchReadingClubs,
  } = useReadingClubStore();

  const [review, setReview] = useState<ReviewType | null>(null);
  const [votedBooks, setVotedBooks] = useState<Set<string>>(new Set());

  const club = readingClubs.find(rc => rc.id === id);

  useEffect(() => {
    if (readingClubs.length === 0) {
      fetchReadingClubs();
    }
    fetchCandidateBooks();
    if (id) {
      fetchReview(id).then(data => setReview(data));
    }
  }, [id, fetchReview, fetchCandidateBooks, fetchReadingClubs, readingClubs.length]);

  const handleVote = async (bookId: string) => {
    if (votedBooks.has(bookId)) return;
    await voteCandidateBook(bookId);
    setVotedBooks(prev => new Set([...prev, bookId]));
    if (id) {
      const updatedReview = await fetchReview(id);
      setReview(updatedReview);
    }
  };

  if (isLoading && !review) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-ochre-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!club || !review) {
    return (
      <div className="card p-12 text-center">
        <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">
          数据加载失败
        </h3>
        <p className="text-ink-700 mb-6">无法加载回顾数据，请稍后重试。</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          返回首页
        </button>
      </div>
    );
  }

  const { book, startDate, endDate, memberCount } = club;
  const totalVotes = review.candidateBooks.reduce((sum, b) => sum + b.votes, 0);
  const sortedCandidates = [...review.candidateBooks].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <button
        onClick={() => navigate(`/reading-club/${id}`)}
        className="flex items-center gap-2 text-ink-700 hover:text-ochre-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回详情
      </button>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-slate-800 to-ochre-900 p-8 sm:p-12 text-white mb-8 opacity-0 animate-fade-in">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ochre-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-ochre-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="w-32 h-44 sm:w-40 sm:h-56 rounded-xl overflow-hidden shadow-2xl bg-paper-200 mx-auto lg:mx-0">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-ochre-400" />
              <span className="text-ochre-300 font-medium">共读回顾</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
              {book.title}
            </h1>
            <p className="text-white/70 text-lg mb-6">{book.author} 著</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold text-ochre-400">{review.totalDiscussions}</p>
                <p className="text-sm text-white/70">讨论总数</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold text-green-400">{memberCount}</p>
                <p className="text-sm text-white/70">参与成员</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold text-blue-400">{club.chapters.length}</p>
                <p className="text-sm text-white/70">共读章节</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-400">
                  {startDate && endDate
                    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))
                    : 0}
                </p>
                <p className="text-sm text-white/70">共读周数</p>
              </div>
            </div>

            <div className="mt-6 text-white/70 text-sm flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(startDate)} - {endDate ? formatDate(endDate) : '进行中'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 opacity-0 animate-stagger-1">
        <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-ochre-500" />
          最受讨论的章节
        </h2>

        <div className="card p-6">
          <div className="space-y-4">
            {review.mostDiscussedChapters.map((item, index) => {
              const maxCount = Math.max(...review.mostDiscussedChapters.map(c => c.count), 1);
              const percentage = (item.count / maxCount) * 100;
              const medals = ['🥇', '🥈', '🥉'];

              return (
                <div
                  key={item.chapterId}
                  className="flex items-center gap-4"
                >
                  <span className="w-8 text-center text-xl">
                    {medals[index] || `#${index + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-ink-900 truncate">
                        {item.chapterTitle}
                      </h4>
                      <span className="text-sm text-ink-700 ml-2 flex-shrink-0">
                        {item.count} 条讨论
                      </span>
                    </div>
                    <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-700',
                          index === 0 ? 'bg-gradient-to-r from-ochre-400 to-ochre-600' :
                          index === 1 ? 'bg-gradient-to-r from-slate-400 to-slate-600' :
                          index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                          'bg-gradient-to-r from-paper-400 to-ink-700'
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mb-8 opacity-0 animate-stagger-2">
        <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-ochre-500" />
          精彩讨论 Top 5
        </h2>

        <div className="space-y-4">
          {review.topDiscussions.map((discussion, index) => (
            <div
              key={discussion.id}
              className="card p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl font-serif font-bold text-ochre-500 flex-shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`badge badge-${discussion.type}`}>
                      {getTypeLabel(discussion.type)}
                    </span>
                    <span className="text-sm text-ink-700">
                      {discussion.userName}
                    </span>
                    <span className="text-sm text-ink-700 flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {discussion.likes}
                    </span>
                  </div>

                  <SpoilerBlock isSpoiler={discussion.isSpoiler}>
                    <p className={cn(
                      'text-ink-900 leading-relaxed',
                      discussion.type === 'excerpt' && 'italic border-l-2 border-ochre-500 pl-4 bg-paper-50 py-2 rounded-r-lg'
                    )}>
                      {discussion.content}
                    </p>
                  </SpoilerBlock>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="opacity-0 animate-stagger-3">
        <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-ochre-500" />
          下一本候选书
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedCandidates.map((book, index) => (
            <CandidateBookCard
              key={book.id}
              book={book}
              rank={index + 1}
              totalVotes={totalVotes}
              isVoted={votedBooks.has(book.id)}
              onVote={() => handleVote(book.id)}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="btn-outline inline-flex items-center gap-2"
          >
            返回读书会列表
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

interface CandidateBookCardProps {
  book: CandidateBook;
  rank: number;
  totalVotes: number;
  isVoted: boolean;
  onVote: () => void;
}

function CandidateBookCard({ book, rank, totalVotes, isVoted, onVote }: CandidateBookCardProps) {
  const percentage = totalVotes > 0 ? (book.votes / totalVotes) * 100 : 0;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">
          {medals[rank - 1] || `#${rank}`}
        </span>
        <span className="text-sm text-ink-700">
          {book.votes} 票
        </span>
      </div>

      <div className="w-24 h-32 mx-auto rounded-lg overflow-hidden shadow-md bg-paper-200 mb-4 flex-shrink-0">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 text-center mb-4">
        <h4 className="font-serif font-bold text-ink-900 mb-1 line-clamp-2">
          {book.title}
        </h4>
        <p className="text-sm text-ink-700">{book.author}</p>
      </div>

      <div className="mb-3">
        <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700',
              rank === 1 ? 'bg-gradient-to-r from-ochre-400 to-ochre-600' :
              rank === 2 ? 'bg-gradient-to-r from-slate-400 to-slate-600' :
              rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
              'bg-gradient-to-r from-paper-400 to-ink-700'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-ink-700 text-center mt-1">
          {percentage.toFixed(1)}%
        </p>
      </div>

      <button
        onClick={onVote}
        disabled={isVoted}
        className={cn(
          'w-full py-2 rounded-lg font-medium text-sm transition-all',
          isVoted
            ? 'bg-green-100 text-green-800 cursor-default'
            : 'bg-ochre-500 text-white hover:bg-ochre-400 active:scale-95'
        )}
      >
        {isVoted ? '已投票' : '投它一票'}
      </button>
    </div>
  );
}

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
