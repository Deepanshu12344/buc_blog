import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Bell, MoreHorizontal, Plus } from 'lucide-react';

export default function Editor() {
  const { profile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [publishing, setPublishing] = useState(false);
  const navigate = useNavigate();

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute) || 1;
  };

  const handlePublish = async () => {
    if (!profile || !title.trim()) return;

    setPublishing(true);
    try {
      const { data, error } = await supabase.from('posts').insert({
        author_id: profile.id,
        title: title.trim(),
        subtitle: content.split('\n')[0].substring(0, 200),
        content: content.trim(),
        published: true,
        published_at: new Date().toISOString(),
        reading_time: calculateReadingTime(content),
      }).select().single();

      if (error) throw error;

      if (data && topics.length > 0) {
        for (const topicName of topics) {
          const { data: topicData } = await supabase
            .from('topics')
            .select('id')
            .eq('name', topicName)
            .maybeSingle();

          let topicId = topicData?.id;

          if (!topicId) {
            const { data: newTopic } = await supabase
              .from('topics')
              .insert({ name: topicName })
              .select('id')
              .single();
            topicId = newTopic?.id;
          }

          if (topicId) {
            await supabase.from('post_topics').insert({
              post_id: data.id,
              topic_id: topicId,
            });
          }
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  const addTopic = () => {
    if (topicInput.trim() && topics.length < 5) {
      setTopics([...topics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
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
              Draft in {profile?.username || 'your stories'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPublishModal(true)}
              disabled={!title.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {profile?.full_name?.[0] || profile?.email?.[0] || 'U'}
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

      {showPublishModal && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Story Preview</h2>

                <div className="mb-8">
                  <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
                    Include a high-quality image in your story to make it more inviting to
                    readers.
                  </div>
                  <h3 className="text-xl font-bold mb-2">{title || 'Untitled'}</h3>
                  <p className="text-gray-600 text-sm">
                    {content.substring(0, 150) || 'No content yet'}
                  </p>
                  <p className="text-xs text-gray-500 mt-4">
                    <strong>Note:</strong> Changes here will affect how your story appears
                    in public places like Medium's homepage and in subscribers' inboxes —
                    not the contents of the story itself.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg mb-2">
                  Publishing to: <strong>{profile?.username || 'Your Profile'}</strong>
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Add or change topics (up to 5) so readers know what your story is about
                </p>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {topics.map((topic, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {topic}
                        <button
                          onClick={() => removeTopic(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {topics.length < 5 && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                        placeholder="Add a topic..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                      />
                      <button
                        onClick={addTopic}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  <a href="#" className="text-green-600 hover:text-green-700">
                    Learn more
                  </a>{' '}
                  about what happens to your story when you publish.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handlePublish}
                    disabled={publishing || !title.trim()}
                    className="flex-1 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {publishing ? 'Publishing...' : 'Publish now'}
                  </button>
                  <button className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
                    Schedule for later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
