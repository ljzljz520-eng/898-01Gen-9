import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    clearError();
  }, [isAuthenticated, navigate, from, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-paper-50 to-paper-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-10 h-10 text-ochre-600" />
            <span className="text-2xl font-serif font-bold text-ink-900">共读社</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-ink-900 mb-2">欢迎回来</h1>
          <p className="text-ink-600">登录账号，继续你的阅读之旅</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="请输入密码"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ink-600">
              还没有账号？{' '}
              <Link
                to="/register"
                className="text-ochre-600 hover:text-ochre-700 font-medium"
              >
                立即注册
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-paper-200">
            <p className="text-sm text-ink-500 text-center mb-3">测试账号</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-paper-50 rounded-lg">
                <p className="font-medium text-ink-700">组织者</p>
                <p className="text-ink-500">organizer@example.com</p>
                <p className="text-ink-500">密码: 123456</p>
              </div>
              <div className="p-3 bg-paper-50 rounded-lg">
                <p className="font-medium text-ink-700">成员</p>
                <p className="text-ink-500">member@example.com</p>
                <p className="text-ink-500">密码: 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
