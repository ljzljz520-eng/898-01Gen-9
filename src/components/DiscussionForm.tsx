import { useState } from 'react';
import { MessageCircle, HelpCircle, BookOpen, Eye, EyeOff, Send } from 'lucide-react';
import type { Chapter } from '../../shared/types';
import type { DiscussionType } from '../../shared/types';
import { cn } from '../utils/helpers';

interface DiscussionFormProps {
  chapters: Chapter[];
  selectedChapterId: string | null;
  onSubmit: (data: {
    chapterId: string | null;
    type: 'comment' | 'question' | 'excerpt';
    content: string;
    isSpoiler: boolean;
  }) => void;
  onCancel?: () => void;
}

export default function DiscussionForm({
  chapters,
  selectedChapterId,
  onSubmit,
  onCancel,
}: DiscussionFormProps) {
  const [type, setType] = useState<'comment' | 'question' | 'excerpt'>('comment');
  const [content, setContent] = useState('');
  const [chapterId, setChapterId] = useState<string | null>(selectedChapterId);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onSubmit({
      chapterId,
      type,
      content: content.trim(),
      isSpoiler,
    });
    setContent('');
    setIsSpoiler(false);
    setIsSubmitting(false);
  };

  const typeOptions: { value: 'comment' | 'question' | 'excerpt'; label: string; icon: React.ReactNode }[] = [
    { value: 'comment', label: '短评', icon: <MessageCircle className="w-4 h-4" /> },
    { value: 'question', label: '提问', icon: <HelpCircle className="w-4 h-4" /> },
    { value: 'excerpt', label: '摘录', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <form onSubmit={handleSubmit} className="card p-5">
      <h4 className="font-serif text-lg font-bold text-ink-900 mb-4">发布讨论</h4>

      <div className="mb-4">
        <label className="label">讨论类型</label>
        <div className="flex gap-2">
          {typeOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all',
                type === option.value
                  ? 'bg-ochre-500 text-white shadow-md'
                  : 'bg-paper-200 text-ink-800 hover:bg-paper-300'
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="label">所属章节</label>
        <select
          value={chapterId || ''}
          onChange={(e) => setChapterId(e.target.value || null)}
          className="input-field"
        >
          <option value="">全本书（不指定章节）</option>
          {chapters.map(chapter => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.title} ({chapter.pageRange})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="label">
          {type === 'comment' && '写下你的短评'}
          {type === 'question' && '提出你的问题'}
          {type === 'excerpt' && '摘录你喜欢的段落'}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === 'comment'
              ? '分享你对这段内容的看法和感受...'
              : type === 'question'
              ? '有什么疑问？提出来让大家一起讨论...'
              : '摘录书中让你印象深刻的段落...'
          }
          rows={4}
          className="input-field resize-none"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div
            className={cn(
              'w-11 h-6 rounded-full p-0.5 transition-colors',
              isSpoiler ? 'bg-ochre-500' : 'bg-paper-300'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 bg-white rounded-full shadow transition-transform',
                isSpoiler ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </div>
          <input
            type="checkbox"
            checked={isSpoiler}
            onChange={(e) => setIsSpoiler(e.target.checked)}
            className="hidden"
          />
          <span className="flex items-center gap-1 text-sm text-ink-800">
            {isSpoiler ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            标记为剧透内容
          </span>
        </label>

        <span className="text-xs text-ink-700">
          {content.length} / 500
        </span>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? '发布中...' : '发布'}
        </button>
      </div>
    </form>
  );
}
