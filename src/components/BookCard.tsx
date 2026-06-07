import { Link } from 'react-router-dom';
import { Calendar, Users, MessageSquare } from 'lucide-react';
import type { ReadingClub } from '../../shared/types';
import { formatDate, getReadingProgress } from '../utils/helpers';

interface BookCardProps {
  readingClub: ReadingClub;
  index?: number;
}

export default function BookCard({ readingClub, index = 0 }: BookCardProps) {
  const { id, book, status, startDate, memberCount, discussions, chapters } = readingClub;
  const progress = getReadingProgress(chapters);
  const animationDelay = `stagger-${Math.min(index + 1, 3)}`;

  return (
    <Link
      to={`/reading-club/${id}`}
      className={`card p-5 block opacity-0 animate-${animationDelay} hover:-translate-y-1`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-24 h-36 sm:w-28 sm:h-40 rounded-lg overflow-hidden bg-paper-200 shadow-md">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif text-lg font-bold text-ink-900 line-clamp-2">
              {book.title}
            </h3>
            <span className={`badge flex-shrink-0 ${status === 'ongoing' ? 'badge-ongoing' : 'badge-ended'}`}>
              {status === 'ongoing' ? '进行中' : '已结束'}
            </span>
          </div>

          <p className="text-ink-700 text-sm mb-3">{book.author}</p>

          <p className="text-ink-700 text-sm line-clamp-2 mb-4">
            {book.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-700 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(startDate)} 开始
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {memberCount} 人参与
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {discussions.length} 条讨论
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-ink-700 mb-1">
              <span>阅读进度</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-ochre-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
