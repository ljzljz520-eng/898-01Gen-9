import { Calendar, Clock, MessageCircle } from 'lucide-react';
import type { Chapter, Discussion } from '../../shared/types';
import { formatDate, getChapterStatus } from '../utils/helpers';
import { cn } from '../utils/helpers';

interface ChapterTimelineProps {
  chapters: Chapter[];
  discussions: Discussion[];
  selectedChapterId: string | null;
  onSelectChapter: (chapterId: string | null) => void;
}

export default function ChapterTimeline({
  chapters,
  discussions,
  selectedChapterId,
  onSelectChapter,
}: ChapterTimelineProps) {
  const getDiscussionCount = (chapterId: string) => {
    return discussions.filter(d => d.chapterId === chapterId).length;
  };

  const getMaxDiscussionCount = () => {
    return Math.max(...chapters.map(ch => getDiscussionCount(ch.id)), 1);
  };

  const maxCount = getMaxDiscussionCount();

  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectChapter(null)}
        className={cn(
          'w-full text-left px-3 py-2 rounded-lg transition-colors mb-3',
          selectedChapterId === null
            ? 'bg-ochre-500 text-white'
            : 'hover:bg-paper-200 text-ink-800'
        )}
      >
        <span className="font-medium">全部章节</span>
        <span className="text-sm ml-2 opacity-75">
          ({discussions.length} 条讨论)
        </span>
      </button>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-paper-300" />

        {chapters.map((chapter, index) => {
          const status = getChapterStatus(chapter.deadline);
          const count = getDiscussionCount(chapter.id);
          const isSelected = selectedChapterId === chapter.id;
          const heatPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={chapter.id} className="relative flex gap-3 pb-6 last:pb-0">
              <div
                className={cn(
                  'timeline-dot mt-1.5 z-10',
                  status === 'completed' && 'timeline-dot-completed',
                  status === 'current' && 'timeline-dot-current',
                  status === 'upcoming' && 'timeline-dot-upcoming'
                )}
              />

              <button
                onClick={() => onSelectChapter(chapter.id)}
                className={cn(
                  'flex-1 text-left p-3 rounded-lg transition-all',
                  isSelected
                    ? 'bg-ochre-500 text-white shadow-md'
                    : 'hover:bg-paper-200',
                  'animate-fade-in'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4
                    className={cn(
                      'font-medium text-sm line-clamp-2',
                      isSelected ? 'text-white' : 'text-ink-900'
                    )}
                  >
                    {chapter.title}
                  </h4>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full flex-shrink-0',
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-paper-300 text-ink-700'
                    )}
                  >
                    {chapter.pageRange}
                  </span>
                </div>

                <div
                  className={cn(
                    'flex flex-wrap items-center gap-3 text-xs',
                    isSelected ? 'text-white/80' : 'text-ink-700'
                  )}
                >
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(chapter.deadline)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {count} 条
                  </span>
                </div>

                {count > 0 && (
                  <div className="mt-2 h-1.5 bg-paper-200/50 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        isSelected ? 'bg-white' : 'bg-ochre-500'
                      )}
                      style={{ width: `${heatPercentage}%` }}
                    />
                  </div>
                )}

                <div
                  className={cn(
                    'mt-2 text-xs',
                    status === 'completed' && (isSelected ? 'text-green-200' : 'text-green-700'),
                    status === 'current' && (isSelected ? 'text-yellow-200' : 'text-amber-700'),
                    status === 'upcoming' && (isSelected ? 'text-white/60' : 'text-slate-500')
                  )}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {status === 'completed' && '已完成'}
                    {status === 'current' && '进行中'}
                    {status === 'upcoming' && '即将开始'}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
