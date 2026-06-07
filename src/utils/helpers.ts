export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  
  return formatDate(dateString);
}

export function getChapterStatus(deadline: string): 'completed' | 'current' | 'upcoming' {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  
  if (deadlineDate < now) return 'completed';
  if (deadlineDate.getTime() - now.getTime() < sevenDaysMs) return 'current';
  return 'upcoming';
}

export function getReadingProgress(chapters: { deadline: string }[]): number {
  const total = chapters.length;
  if (total === 0) return 0;
  
  const completed = chapters.filter(ch => getChapterStatus(ch.deadline) === 'completed').length;
  return Math.round((completed / total) * 100);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getTypeLabel(type: 'comment' | 'question' | 'excerpt'): string {
  const labels: Record<string, string> = {
    comment: '短评',
    question: '提问',
    excerpt: '摘录',
  };
  return labels[type] || type;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
