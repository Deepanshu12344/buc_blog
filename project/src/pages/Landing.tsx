import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="border-b border-gray-900 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-3xl font-serif text-gray-900">BookUpCulture</h1>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-sm hover:opacity-70">
              Our story
            </Link>
            <Link to="/login" className="text-sm hover:opacity-70">
              Membership
            </Link>
            <Link to="/login" className="text-sm hover:opacity-70">
              Write
            </Link>
            <Link to="/login" className="text-sm hover:opacity-70">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-7xl md:text-8xl font-serif text-gray-900 mb-6 leading-tight">
                Human
                <br />
                stories & ideas
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                A place to read, write, and deepen your understanding
              </p>
              <Link
                to="/signup"
                className="inline-block bg-gray-900 text-white px-12 py-3 rounded-full text-lg hover:bg-gray-800 transition-colors"
              >
                Start reading
              </Link>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative w-full max-w-md aspect-square">
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full"
                  style={{ transform: 'rotate(-5deg)' }}
                >
                  <circle cx="200" cy="120" r="80" fill="#10b981" opacity="0.9" />
                  <circle cx="180" cy="140" r="70" fill="#10b981" opacity="0.8" />
                  <circle cx="220" cy="140" r="70" fill="#10b981" opacity="0.8" />
                  <circle cx="160" cy="160" r="60" fill="#10b981" opacity="0.7" />
                  <circle cx="240" cy="160" r="60" fill="#10b981" opacity="0.7" />

                  <path
                    d="M 150 200 L 180 250 L 200 240 L 220 250 L 250 200 L 280 300 L 200 350 L 120 300 Z"
                    fill="#10b981"
                    opacity="0.6"
                  />

                  <g opacity="0.3">
                    <line
                      x1="250"
                      y1="200"
                      x2="320"
                      y2="180"
                      stroke="#000"
                      strokeWidth="1"
                      strokeDasharray="4"
                    />
                    <line
                      x1="280"
                      y1="300"
                      x2="340"
                      y2="320"
                      stroke="#000"
                      strokeWidth="1"
                      strokeDasharray="4"
                    />
                    <line
                      x1="200"
                      y1="350"
                      x2="220"
                      y2="380"
                      stroke="#000"
                      strokeWidth="1"
                      strokeDasharray="4"
                    />
                    <circle cx="320" cy="180" r="3" fill="#000" />
                    <circle cx="340" cy="320" r="3" fill="#000" />
                    <circle cx="220" cy="380" r="3" fill="#000" />
                  </g>

                  <g opacity="0.4">
                    {[...Array(8)].map((_, i) => (
                      <text
                        key={i}
                        x={100 + i * 30}
                        y={100 + Math.sin(i) * 20}
                        fontSize="8"
                        fill="#000"
                      >
                        ★
                      </text>
                    ))}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-900 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <a href="#" className="hover:opacity-70">
              Help
            </a>
            <a href="#" className="hover:opacity-70">
              Status
            </a>
            <a href="#" className="hover:opacity-70">
              About
            </a>
            <a href="#" className="hover:opacity-70">
              Careers
            </a>
            <a href="#" className="hover:opacity-70">
              Press
            </a>
            <a href="#" className="hover:opacity-70">
              Blog
            </a>
            <a href="#" className="hover:opacity-70">
              Privacy
            </a>
            <a href="#" className="hover:opacity-70">
              Rules
            </a>
            <a href="#" className="hover:opacity-70">
              Terms
            </a>
            <a href="#" className="hover:opacity-70">
              Text to speech
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
