import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper-100">
      <header className="sticky top-0 z-50 bg-paper-100/95 backdrop-blur-sm border-b border-paper-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-ink-900 rounded-lg flex items-center justify-center group-hover:bg-ochre-500 transition-colors">
                <BookOpen className="w-5 h-5 text-paper-100" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-ink-900">共读社</h1>
                <p className="text-xs text-ink-700">一起读书，共同成长</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-ink-800 hover:bg-paper-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">首页</span>
              </Link>
              <button
                onClick={() => navigate('/create')}
                className="btn-primary flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">创建共读</span>
                <span className="sm:hidden">创建</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-paper-300 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-ink-700 text-sm">
          <p>© 2026 共读社 · 让阅读不再孤单</p>
        </div>
      </footer>
    </div>
  );
}
