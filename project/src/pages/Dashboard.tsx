import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Post } from '../lib/supabase';
import {
  Home,
  Bookmark,
  User,
  BarChart2,
  FileText,
  Users,
  Search,
  Bell,
  PenSquare,
  Menu,
  Star,
  MessageCircle,
  MoreHorizontal,
} from 'lucide-react';

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'for-you' | 'featured'>('for-you');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
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

  const handleSignOut = async () => {
    await signOut();
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
              {profile?.full_name?.[0] || profile?.email?.[0] || 'U'}
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

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Following</span>
            </div>
            <button className="text-sm text-green-600 hover:text-green-700">
              Find writers and publications to follow
            </button>
            <p className="text-xs text-gray-500 mt-2">See suggestions</p>
          </div>

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
            ) : posts.length === 0 ? (
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
                {posts.map((post) => (
                  <article key={post.id} className="group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">
                            {post.profiles?.full_name || 'Anonymous'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-8">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:opacity-70 cursor-pointer line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.subtitle}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>
                              {formatDate(post.published_at || post.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{Math.floor(Math.random() * 100)}K</span>
                          </div>
                          <span>{post.reading_time} min read</span>
                          <button className="ml-auto p-1 hover:bg-gray-100 rounded">
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {post.cover_image && (
                        <div className="w-32 h-24 bg-gray-200 rounded flex-shrink-0">
                          <img
                            src={post.cover_image}
                            alt=""
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>

        <aside className="hidden xl:block w-80 px-6 py-8 sticky top-16 self-start border-l border-gray-200">
          <h3 className="text-sm font-semibold mb-4">Staff Picks</h3>
          <div className="space-y-4">
            {[
              {
                author: 'Barack Obama',
                title: 'Here Are My Favorite Books, Movies, and Music of 2025',
                date: '2d ago',
              },
              {
                author: 'Constantin Patrascu',
                title:
                  "I'm a Psychologist and I Let My Kids Have Screen Time: Here's Why the Research Might Surprise You",
                date: 'Dec 13',
              },
              {
                author: 'John Battelle',
                title: "You Can't Save the Web With Biz Dev Deals",
                date: 'Dec 13',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1">{item.author}</p>
                  <h4 className="text-sm font-semibold mb-1 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="text-sm text-green-600 hover:text-green-700 mt-4">
            See the full list
          </button>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold mb-4">Recommended topics</h3>
            <div className="flex flex-wrap gap-2">
              {['Self Improvement', 'Cryptocurrency', 'Technology', 'Writing', 'AI'].map(
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
          </div>
        </aside>
      </div>
    </div>
  );
}
