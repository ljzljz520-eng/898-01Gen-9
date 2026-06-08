import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Upload,
  Send,
} from 'lucide-react';
import { useReadingClubStore } from '../store/useReadingClubStore';
import { useAuthStore } from '../store/useAuthStore';
import type { CreateReadingClubInput } from '../../shared/types';

interface ChapterForm {
  title: string;
  startPage: number;
  endPage: number;
  deadline: string;
}

interface OfflineEventForm {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function CreateReadingClub() {
  const navigate = useNavigate();
  const { createReadingClub } = useReadingClubStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bookInfo, setBookInfo] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    totalPages: 0,
  });

  const [chapters, setChapters] = useState<ChapterForm[]>([
    { title: '', startPage: 1, endPage: 50, deadline: '' },
  ]);

  const [offlineEvents, setOfflineEvents] = useState<OfflineEventForm[]>([]);

  const addChapter = () => {
    const lastChapter = chapters[chapters.length - 1];
    const nextStartPage = lastChapter ? lastChapter.endPage + 1 : 1;
    setChapters([
      ...chapters,
      {
        title: '',
        startPage: nextStartPage,
        endPage: nextStartPage + 49,
        deadline: '',
      },
    ]);
  };

  const removeChapter = (index: number) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const updateChapter = (index: number, field: keyof ChapterForm, value: string | number) => {
    const updated = [...chapters];
    updated[index] = { ...updated[index], [field]: value };
    setChapters(updated);
  };

  const addOfflineEvent = () => {
    setOfflineEvents([
      ...offlineEvents,
      { title: '', date: '', time: '19:30', location: '', description: '' },
    ]);
  };

  const removeOfflineEvent = (index: number) => {
    setOfflineEvents(offlineEvents.filter((_, i) => i !== index));
  };

  const updateOfflineEvent = (
    index: number,
    field: keyof OfflineEventForm,
    value: string
  ) => {
    const updated = [...offlineEvents];
    updated[index] = { ...updated[index], [field]: value };
    setOfflineEvents(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookInfo.title || !bookInfo.author || chapters.some(ch => !ch.title || !ch.deadline)) {
      alert('请填写完整的书籍信息和章节计划');
      return;
    }

    setIsSubmitting(true);

    try {
      const coverImage = bookInfo.coverImage || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20design%20${encodeURIComponent(bookInfo.title)}%20literary%20style&image_size=portrait_4_3`;

      const input: CreateReadingClubInput = {
        book: {
          title: bookInfo.title,
          author: bookInfo.author,
          description: bookInfo.description || '一本值得深度阅读的好书',
          coverImage,
          totalPages: bookInfo.totalPages || chapters[chapters.length - 1]?.endPage || 300,
        },
        chapters: chapters.map((ch, idx) => ({
          title: ch.title,
          pageRange: `第 ${ch.startPage}-${ch.endPage} 页`,
          startPage: ch.startPage,
          endPage: ch.endPage,
          deadline: ch.deadline,
          order: idx + 1,
        })),
        offlineEvents: offlineEvents
          .filter(e => e.title && e.date && e.location)
          .map(e => ({
            title: e.title,
            date: e.date,
            time: e.time,
            location: e.location,
            description: e.description,
            attendeeCount: 0,
          })),
        organizerId: user!.id,
        organizerName: user!.name,
      };

      const newClub = await createReadingClub(input);
      navigate(`/reading-club/${newClub.id}`);
    } catch (error) {
      console.error('创建失败:', error);
      alert('创建失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-ink-700 hover:text-ochre-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 opacity-0 animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">
            创建新共读
          </h1>
          <p className="text-ink-700">
            填写书籍信息、制定章节计划，开启一期新的阅读之旅
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="card p-6 opacity-0 animate-stagger-1">
            <h2 className="font-serif text-xl font-bold text-ink-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-ochre-500" />
              书籍信息
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">书名 *</label>
                <input
                  type="text"
                  value={bookInfo.title}
                  onChange={(e) => setBookInfo({ ...bookInfo, title: e.target.value })}
                  placeholder="例如：百年孤独"
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">作者 *</label>
                <input
                  type="text"
                  value={bookInfo.author}
                  onChange={(e) => setBookInfo({ ...bookInfo, author: e.target.value })}
                  placeholder="例如：加西亚·马尔克斯"
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">书籍简介</label>
                <textarea
                  value={bookInfo.description}
                  onChange={(e) => setBookInfo({ ...bookInfo, description: e.target.value })}
                  placeholder="简要介绍这本书的内容和特点..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="label">总页数</label>
                <input
                  type="number"
                  value={bookInfo.totalPages || ''}
                  onChange={(e) => setBookInfo({ ...bookInfo, totalPages: parseInt(e.target.value) || 0 })}
                  placeholder="360"
                  className="input-field"
                  min="1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">封面图片 URL（可选）</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={bookInfo.coverImage}
                    onChange={(e) => setBookInfo({ ...bookInfo, coverImage: e.target.value })}
                    placeholder="https://example.com/cover.jpg"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    className="btn-secondary flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Upload className="w-4 h-4" />
                    上传
                  </button>
                </div>
                <p className="text-xs text-ink-700 mt-1">
                  留空将自动生成封面
                </p>
              </div>
            </div>
          </section>

          <section className="card p-6 opacity-0 animate-stagger-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold text-ink-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-ochre-500" />
                章节计划 *
              </h2>
              <button
                type="button"
                onClick={addChapter}
                className="btn-secondary flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" />
                添加章节
              </button>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-paper-50 rounded-xl p-4 border border-paper-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-ink-900">
                      第 {index + 1} 章
                    </h3>
                    {chapters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChapter(index)}
                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <label className="label">章节标题 *</label>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(index, 'title', e.target.value)}
                        placeholder="例如：第一章：马孔多的创建"
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">起始页</label>
                      <input
                        type="number"
                        value={chapter.startPage}
                        onChange={(e) => updateChapter(index, 'startPage', parseInt(e.target.value) || 1)}
                        className="input-field"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="label">结束页</label>
                      <input
                        type="number"
                        value={chapter.endPage}
                        onChange={(e) => updateChapter(index, 'endPage', parseInt(e.target.value) || 1)}
                        className="input-field"
                        min={chapter.startPage}
                      />
                    </div>

                    <div>
                      <label className="label">截止日期 *</label>
                      <input
                        type="date"
                        value={chapter.deadline}
                        onChange={(e) => updateChapter(index, 'deadline', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6 opacity-0 animate-stagger-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold text-ink-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-ochre-500" />
                线下活动（可选）
              </h2>
              <button
                type="button"
                onClick={addOfflineEvent}
                className="btn-secondary flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" />
                添加活动
              </button>
            </div>

            {offlineEvents.length === 0 ? (
              <div className="text-center py-8 text-ink-700">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-ink-400" />
                <p>还没有添加线下活动</p>
                <p className="text-sm">点击上方按钮添加线下见面会</p>
              </div>
            ) : (
              <div className="space-y-4">
                {offlineEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-paper-50 rounded-xl p-4 border border-paper-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-ink-900">
                        活动 {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeOfflineEvent(index)}
                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="label">活动名称</label>
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) => updateOfflineEvent(index, 'title', e.target.value)}
                          placeholder="例如：第一次线下见面会"
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="label flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          日期
                        </label>
                        <input
                          type="date"
                          value={event.date}
                          onChange={(e) => updateOfflineEvent(index, 'date', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="label flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          时间
                        </label>
                        <input
                          type="time"
                          value={event.time}
                          onChange={(e) => updateOfflineEvent(index, 'time', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="label flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          地点
                        </label>
                        <input
                          type="text"
                          value={event.location}
                          onChange={(e) => updateOfflineEvent(index, 'location', e.target.value)}
                          placeholder="例如：城市书房·三楼多功能厅"
                          className="input-field"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="label">活动描述</label>
                        <textarea
                          value={event.description}
                          onChange={(e) => updateOfflineEvent(index, 'description', e.target.value)}
                          placeholder="简要描述本次活动的内容..."
                          rows={2}
                          className="input-field resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex gap-4 pb-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary flex-1"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? '创建中...' : '创建共读'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
