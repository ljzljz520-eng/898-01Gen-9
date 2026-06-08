import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, MessageSquare, Plus, TrendingUp, LogIn } from 'lucide-react';
import { useReadingClubStore } from '../store/useReadingClubStore';
import { useAuthStore } from '../store/useAuthStore';
import BookCard from '../components/BookCard';
import type { ReadingClub } from '../../shared/types';
import { cn } from '../utils/helpers';

type FilterType = 'all' | 'ongoing' | 'ended';

export default function Home() {
  const navigate = useNavigate();
  const { readingClubs, isLoading, fetchReadingClubs, fetchCandidateBooks } = useReadingClubStore();
  const { isAuthenticated, user } = useAuthStore();
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchReadingClubs();
    fetchCandidateBooks();
  }, [fetchReadingClubs, fetchCandidateBooks]);

  const ongoingClubs = readingClubs.filter(rc => rc.status === 'ongoing');
  const endedClubs = readingClubs.filter(rc => rc.status === 'ended');

  const filteredClubs: ReadingClub[] = {
    all: readingClubs,
    ongoing: ongoingClubs,
    ended: endedClubs,
  }[filter];

  const totalDiscussions = readingClubs.reduce((sum, rc) => sum + rc.discussions.length, 0);
  const totalMembers = readingClubs.reduce((sum, rc) => sum + rc.memberCount, 0);

  if (isLoading && readingClubs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-ochre-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <section className="mb-12 opacity-0 animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-slate-900 to-slate-800 p-8 sm:p-12 text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-ochre-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-ochre-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              一起读书，<span className="text-ochre-400">共同成长</span>
            </h1>
            <p className="text-white/70 text-lg mb-8">
              加入读书会，与志同道合的伙伴一起深度阅读，分享思考，碰撞观点。
              每一本书都是一次心灵的旅行，让我们结伴同行。
            </p>
            <div className="flex flex-wrap gap-4">
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login', { state: { from: '/create' } })}
                  className="bg-ochre-500 hover:bg-ochre-400 text-white px-8 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-ochre-500/30 active:scale-95 flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  登录后创建
                </button>
              ) : user?.role === 'organizer' ? (
                <button
                  onClick={() => navigate('/create')}
                  className="bg-ochre-500 hover:bg-ochre-400 text-white px-8 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-ochre-500/30 active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  创建共读
                </button>
              ) : null}
              <button
                onClick={() => document.getElementById('club-list')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-all active:scale-95 backdrop-blur-sm"
              >
                浏览读书会
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="card p-6 opacity-0 animate-stagger-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ochre-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-ochre-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-ink-900">{readingClubs.length}</p>
              <p className="text-sm text-ink-700">共读书籍</p>
            </div>
          </div>
        </div>

        <div className="card p-6 opacity-0 animate-stagger-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-ink-900">{totalMembers}</p>
              <p className="text-sm text-ink-700">参与成员</p>
            </div>
          </div>
        </div>

        <div className="card p-6 opacity-0 animate-stagger-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-ink-900">{totalDiscussions}</p>
              <p className="text-sm text-ink-700">讨论记录</p>
            </div>
          </div>
        </div>
      </section>

      <section id="club-list">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-ochre-500" />
            读书会
          </h2>

          <div className="flex gap-2">
            {(['all', 'ongoing', 'ended'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  filter === f
                    ? 'bg-ochre-500 text-white shadow-md'
                    : 'bg-paper-200 text-ink-800 hover:bg-paper-300'
                )}
              >
                {f === 'all' && '全部'}
                {f === 'ongoing' && `进行中 (${ongoingClubs.length})`}
                {f === 'ended' && `已结束 (${endedClubs.length})`}
              </button>
            ))}
          </div>
        </div>

        {filteredClubs.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-paper-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-ink-400" />
            </div>
            <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">
              还没有读书会
            </h3>
            <p className="text-ink-700 mb-6">
              {!isAuthenticated 
                ? '登录后创建你的第一期共读吧！'
                : user?.role === 'organizer'
                  ? '成为第一个组织者，创建你的第一期共读吧！'
                  : '请等待组织者创建读书会，或者注册成为组织者。'
              }
            </p>
            {!isAuthenticated ? (
              <button
                onClick={() => navigate('/login', { state: { from: '/create' } })}
                className="btn-primary inline-flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                登录后创建
              </button>
            ) : user?.role === 'organizer' ? (
              <button
                onClick={() => navigate('/create')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建共读
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClubs.map((club, index) => (
              <BookCard key={club.id} readingClub={club} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
