import { MessageCircle, HelpCircle, BookOpen, Heart } from 'lucide-react';
import type { Discussion, Chapter } from '../../shared/types';
import { formatRelativeTime, getTypeLabel } from '../utils/helpers';
import SpoilerBlock from './SpoilerBlock';
import { cn } from '../utils/helpers';

interface DiscussionCardProps {
  discussion: Discussion;
  chapters: Chapter[];
  onLike: (discussionId: string) => void;
  index?: number;
}

export default function DiscussionCard({
  discussion,
  chapters,
  onLike,
  index = 0,
}: DiscussionCardProps) {
  const { type, content, isSpoiler, userName, createdAt, likes, chapterId } = discussion;

  const chapter = chapters.find(ch => ch.id === chapterId);
  const animationDelay = Math.min(index + 1, 3);

  const typeIcon = {
    comment: <MessageCircle className="w-3.5 h-3.5" />,
    question: <HelpCircle className="w-3.5 h-3.5" />,
    excerpt: <BookOpen className="w-3.5 h-3.5" />,
  }[type];

  const badgeClass = {
    comment: 'badge-comment',
    question: 'badge-question',
    excerpt: 'badge-excerpt',
  }[type];

  return (
    <div
      className={`card p-5 opacity-0 animate-stagger-${animationDelay}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${badgeClass} flex items-center gap-1`}>
            {typeIcon}
            {getTypeLabel(type)}
          </span>
          {chapter && (
            <span className="text-xs text-ink-700 bg-paper-200 px-2 py-0.5 rounded-full">
              {chapter.title}
            </span>
          )}
        </div>
        <span className="text-xs text-ink-700 flex-shrink-0">
          {formatRelativeTime(createdAt)}
        </span>
      </div>

      <div className="mb-3">
        <SpoilerBlock isSpoiler={isSpoiler}>
          <p className={cn(
            'text-ink-900 leading-relaxed',
            type === 'excerpt' && 'italic border-l-2 border-ochre-500 pl-4 bg-paper-50 py-2 rounded-r-lg'
          )}>
            {content}
          </p>
        </SpoilerBlock>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-paper-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ochre-400 to-ochre-600 flex items-center justify-center text-white text-xs font-medium">
            {userName.charAt(0)}
          </div>
          <span className="text-sm text-ink-800 font-medium">{userName}</span>
        </div>

        <button
          onClick={() => onLike(discussion.id)}
          className="flex items-center gap-1.5 text-sm text-ink-700 hover:text-ochre-500 transition-colors group"
        >
          <Heart className="w-4 h-4 group-hover:fill-ochre-500 transition-colors" />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
}
