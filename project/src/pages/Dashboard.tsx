import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { blogApi } from '../lib/api';
import {
  Home,
  Bookmark,
  User,
  BarChart2,
  FileText,
  Search,
  Bell,
  PenSquare,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Heart,
} from 'lucide-react';

type Blog = {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  likes: number;
  comments: any[];
  createdAt: string;
  updatedAt: string;
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'for-you' | 'featured'>('for-you');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await blogApi.getAll();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/dashboard">
              <h1 className="text-3xl font-serif">Medium</h1>
            </Link>
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 ml-4">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-sm w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/editor"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <PenSquare className="w-5 h-5" />
              <span className="hidden sm:inline">Write</span>
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {user?.fullname?.[0] || user?.email?.[0] || 'U'}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block w-64 border-r border-gray-200 min-h-screen p-6 fixed lg:sticky top-16 bg-white z-40`}
        >
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-gray-900 bg-gray-100 rounded hover:bg-gray-100"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm">Home</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <Bookmark className="w-5 h-5" />
              <span className="text-sm">Library</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <User className="w-5 h-5" />
              <span className="text-sm">Profile</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm">Stories</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-sm">Stats</span>
            </Link>
          </nav>

          <button
            onClick={handleSignOut}
            className="mt-8 text-sm text-gray-600 hover:text-gray-900"
          >
            Sign out
          </button>
        </aside>

        <main className="flex-1 lg:ml-64 px-6 py-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-8 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('for-you')}
                className={`pb-3 px-1 text-sm ${
                  activeTab === 'for-you'
                    ? 'border-b-2 border-gray-900 text-gray-900'
                    : 'text-gray-600'
                }`}
              >
                For you
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`pb-3 px-1 text-sm ${
                  activeTab === 'featured'
                    ? 'border-b-2 border-gray-900 text-gray-900'
                    : 'text-gray-600'
                }`}
              >
                Featured
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading posts...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No posts yet</p>
                <Link
                  to="/editor"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
                >
                  <PenSquare className="w-4 h-4" />
                  Write your first story
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {blogs.map((blog) => (
                  <article key={blog._id} className="group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-medium">
                        {blog.author?.firstname?.[0] || 'A'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">
                            {blog.author?.firstname} {blog.author?.lastname}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-8">
                      <div className="flex-1">
                        <Link to={`/post/${blog._id}`}>
                          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:opacity-70 cursor-pointer line-clamp-2">
                            {blog.title}
                          </h2>
                        </Link>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {getExcerpt(blog.content)}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatDate(blog.createdAt)}</span>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{blog.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{blog.comments?.length || 0}</span>
                          </div>
                          <button className="ml-auto p-1 hover:bg-gray-100 rounded">
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>

        <aside className="hidden xl:block w-80 px-6 py-8 sticky top-16 self-start border-l border-gray-200">
          <h3 className="text-sm font-semibold mb-4">Recommended topics</h3>
          <div className="flex flex-wrap gap-2">
            {['Programming', 'Technology', 'Writing', 'AI', 'Web Development'].map(
              (topic) => (
                <button
                  key={topic}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                >
                  {topic}
                </button>
              )
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}