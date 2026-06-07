import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Clock,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Plus,
  StopCircle,
  BarChart3,
  User,
} from 'lucide-react';
import { useReadingClubStore } from '../store/useReadingClubStore';
import ChapterTimeline from '../components/ChapterTimeline';
import DiscussionCard from '../components/DiscussionCard';
import DiscussionForm from '../components/DiscussionForm';
import type { DiscussionType } from '../../shared/types';
import { formatDate, getReadingProgress, cn } from '../utils/helpers';

export default function ReadingClubDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    readingClubs,
    isLoading,
    fetchReadingClubs,
    addDiscussion,
    likeDiscussion,
    endReadingClub,
    currentUser,
  } = useReadingClubStore();

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [discussionType, setDiscussionType] = useState<DiscussionType>('all');
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);

  const club = readingClubs.find(rc => rc.id === id);
  const isOrganizer = club && currentUser.id === club.organizerId;

  useEffect(() => {
    if (readingClubs.length === 0) {
      fetchReadingClubs();
    }
  }, [readingClubs.length, fetchReadingClubs]);

  if (isLoading && !club) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-ochre-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="card p-12 text-center">
        <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">
          读书会不存在
        </h3>
        <p className="text-ink-700 mb-6">该读书会可能已被删除或不存在。</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          返回首页
        </button>
      </div>
    );
  }

  const { book, chapters, discussions, offlineEvents, status, startDate, endDate, memberCount, organizerName } = club;
  const progress = getReadingProgress(chapters);

  const filteredDiscussions = discussions.filter(d => {
    const matchesChapter = selectedChapterId === null || d.chapterId === selectedChapterId;
    const matchesType = discussionType === 'all' || d.type === discussionType;
    return matchesChapter && matchesType;
  });

  const handleAddDiscussion = async (data: {
    chapterId: string | null;
    type: 'comment' | 'question' | 'excerpt';
    content: string;
    isSpoiler: boolean;
  }) => {
    if (!club) return;
    await addDiscussion(club.id, data);
    setShowDiscussionForm(false);
  };

  const handleLikeDiscussion = async (discussionId: string) => {
    if (!club) return;
    await likeDiscussion(club.id, discussionId);
  };

  const handleEndClub = async () => {
    if (!club || !confirm('确定要结束这期共读吗？结束后将不可恢复。')) return;
    await endReadingClub(club.id);
    navigate(`/reading-club/${club.id}/review`);
  };

  const typeOptions: { value: DiscussionType; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: '全部', icon: <MessageCircle className="w-4 h-4" /> },
    { value: 'comment', label: '短评', icon: <MessageCircle className="w-4 h-4" /> },
    { value: 'question', label: '提问', icon: <HelpCircle className="w-4 h-4" /> },
    { value: 'excerpt', label: '摘录', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-ink-700 hover:text-ochre-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </button>

      <section className="card p-6 sm:p-8 mb-8 opacity-0 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="w-40 h-56 sm:w-48 sm:h-64 rounded-xl overflow-hidden shadow-lg bg-paper-200">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
                    {book.title}
                  </h1>
                  <span className={`badge ${status === 'ongoing' ? 'badge-ongoing' : 'badge-ended'}`}>
                    {status === 'ongoing' ? '进行中' : '已结束'}
                  </span>
                </div>
                <p className="text-ink-700">{book.author} 著</p>
              </div>

              <div className="flex gap-2">
                {isOrganizer && status === 'ongoing' && (
                  <>
                    <button
                      onClick={handleEndClub}
                      className="btn-secondary flex items-center gap-1.5 text-sm"
                    >
                      <StopCircle className="w-4 h-4" />
                      结束共读
                    </button>
                    <Link
                      to={`/reading-club/${club.id}/review`}
                      className="btn-outline flex items-center gap-1.5 text-sm"
                    >
                      <BarChart3 className="w-4 h-4" />
                      查看回顾
                    </Link>
                  </>
                )}
                {status === 'ended' && (
                  <Link
                    to={`/reading-club/${club.id}/review`}
                    className="btn-primary flex items-center gap-1.5 text-sm"
                  >
                    <BarChart3 className="w-4 h-4" />
                    查看回顾
                  </Link>
                )}
              </div>
            </div>

            <p className="text-ink-800 leading-relaxed mb-6">
              {book.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-paper-100 rounded-lg p-3">
                <p className="text-xs text-ink-700 mb-1">阅读进度</p>
                <p className="text-xl font-bold text-ink-900">{progress}%</p>
              </div>
              <div className="bg-paper-100 rounded-lg p-3">
                <p className="text-xs text-ink-700 mb-1">参与人数</p>
                <p className="text-xl font-bold text-ink-900">{memberCount}</p>
              </div>
              <div className="bg-paper-100 rounded-lg p-3">
                <p className="text-xs text-ink-700 mb-1">讨论数</p>
                <p className="text-xl font-bold text-ink-900">{discussions.length}</p>
              </div>
              <div className="bg-paper-100 rounded-lg p-3">
                <p className="text-xs text-ink-700 mb-1">章节数</p>
                <p className="text-xl font-bold text-ink-900">{chapters.length}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-ink-700 mb-2">
                <span>整体阅读进度</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ochre-400 to-ochre-600 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-700">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                组织者：{organizerName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(startDate)} 开始
                {endDate && ` · ${formatDate(endDate)} 结束`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {offlineEvents.length > 0 && (
        <section className="mb-8 opacity-0 animate-stagger-1">
          <h2 className="font-serif text-xl font-bold text-ink-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ochre-500" />
            线下活动
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offlineEvents.map((event, index) => (
              <div
                key={event.id}
                className="card p-5 opacity-0 animate-stagger-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-serif font-bold text-ink-900 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-ink-700">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-ochre-500" />
                    {formatDate(event.date)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ochre-500" />
                    {event.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-ochre-500" />
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-ochre-500" />
                    {event.attendeeCount} 人参加
                  </p>
                </div>
                {event.description && (
                  <p className="mt-3 text-sm text-ink-800 bg-paper-100 p-3 rounded-lg">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 opacity-0 animate-stagger-2">
          <div className="sticky top-24">
            <h2 className="font-serif text-xl font-bold text-ink-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-ochre-500" />
              章节计划
            </h2>
            <div className="card p-4">
              <ChapterTimeline
                chapters={chapters}
                discussions={discussions}
                selectedChapterId={selectedChapterId}
                onSelectChapter={setSelectedChapterId}
              />
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8 opacity-0 animate-stagger-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="font-serif text-xl font-bold text-ink-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-ochre-500" />
              讨论区
              <span className="text-sm font-normal text-ink-700">
                ({filteredDiscussions.length} 条)
              </span>
            </h2>

            {status === 'ongoing' && !showDiscussionForm && (
              <button
                onClick={() => setShowDiscussionForm(true)}
                className="btn-primary flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" />
                发布讨论
              </button>
            )}
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDiscussionType(option.value)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all',
                  discussionType === option.value
                    ? 'bg-ochre-500 text-white shadow-md'
                    : 'bg-paper-200 text-ink-800 hover:bg-paper-300'
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>

          {showDiscussionForm && status === 'ongoing' && (
            <div className="mb-6">
              <DiscussionForm
                chapters={chapters}
                selectedChapterId={selectedChapterId}
                onSubmit={handleAddDiscussion}
                onCancel={() => setShowDiscussionForm(false)}
              />
            </div>
          )}

          {filteredDiscussions.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-paper-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-ink-400" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">
                还没有讨论
              </h3>
              <p className="text-ink-700 mb-6">
                {selectedChapterId
                  ? '这一章节还没有讨论，来发表你的第一条想法吧！'
                  : '快来分享你的阅读感受吧！'}
              </p>
              {status === 'ongoing' && !showDiscussionForm && (
                <button
                  onClick={() => setShowDiscussionForm(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  发布讨论
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDiscussions.map((discussion, index) => (
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                  chapters={chapters}
                  onLike={handleLikeDiscussion}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
