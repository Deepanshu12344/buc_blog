import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, MoreHorizontal, Plus } from 'lucide-react';
import { blogApi } from '../lib/api';

export default function Editor() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!user || !title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    setPublishing(true);
    try {
      await blogApi.create(title.trim(), content.trim());
      navigate('/dashboard');
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <h1 className="text-2xl font-serif">Medium</h1>
            </Link>
            <span className="text-sm text-gray-500">
              Draft in {user?.fullname || 'your stories'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePublish}
              disabled={!title.trim() || !content.trim() || publishing}
              className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {user?.fullname?.[0] || user?.email?.[0] || 'U'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-50 mb-8">
            <Plus className="w-6 h-6 text-gray-400" />
          </button>

          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-4xl font-serif placeholder-gray-300 outline-none resize-none mb-4"
            rows={2}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="w-full text-xl placeholder-gray-300 outline-none resize-none min-h-[400px] leading-relaxed"
          />
        </div>
      </main>
    </div>
  );
}