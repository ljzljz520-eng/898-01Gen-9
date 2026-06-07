import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../utils/helpers';

interface SpoilerBlockProps {
  children: React.ReactNode;
  isSpoiler: boolean;
}

export default function SpoilerBlock({ children, isSpoiler }: SpoilerBlockProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isSpoiler) {
    return <>{children}</>;
  }

  const showContent = isRevealed;

  return (
    <div className="relative">
      <div
        className={cn(
          'spoiler-content transition-all duration-300',
          showContent ? 'expanded' : 'collapsed'
        )}
      >
        {children}
      </div>

      {!showContent && (
        <button
          onClick={() => setIsRevealed(true)}
          className="absolute inset-0 flex items-center justify-center bg-ink-900/10 backdrop-blur-[2px] rounded-lg hover:bg-ink-900/20 transition-colors"
        >
          <div className="flex flex-col items-center gap-2 text-ink-800 bg-paper-100 px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4" />
              <span className="text-sm font-medium">此内容包含剧透</span>
            </div>
            <span className="text-xs text-ink-700 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              点击查看
            </span>
          </div>
        </button>
      )}

      {showContent && (
        <button
          onClick={() => setIsRevealed(false)}
          className="mt-2 flex items-center gap-1 text-xs text-ink-700 hover:text-ochre-500 transition-colors"
        >
          <EyeOff className="w-3 h-3" />
          隐藏剧透
        </button>
      )}
    </div>
  );
}
