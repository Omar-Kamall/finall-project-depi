import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import blogData from './blogData.json';
import groceryImage from '../../Imgs/posts/grocers.png';
import fridayImage from '../../Imgs/posts/friday.png';
import dunhumbyImage from '../../Imgs/posts/dunnhumby.png';
import sustainableImage from '../../Imgs/posts/sustainable.png';
import mealKitImage from '../../Imgs/posts/meal-kit.png';
import organicImage from '../../Imgs/posts/organic.png';
import sourcingImage from '../../Imgs/posts/sourcing.png';
import smartShoppingImage from '../../Imgs/posts/smart-shopping.png';

// Image mapping - maps image names from JSON to imported images
const imageMap = {
  'grocers.png': groceryImage,
  'friday.png': fridayImage,
  'dunnhumby.png': dunhumbyImage,
  'sustainable.png': sustainableImage,
  'meal-kit.png': mealKitImage,
  'organic.png': organicImage,
  'sourcing.png': sourcingImage,
  'smart-shopping.png': smartShoppingImage,
};

// Calculate reading time based on content length
const calculateReadingTime = (content) => {
  const wordsPerSecond = 3;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerSecond);
  return readingTime;
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogData.find((p) => p.id === parseInt(id));
  
  // Get related posts (exclude current post)
  const relatedPosts = blogData
    .filter((p) => p.id !== parseInt(id))
    .slice(0, 3);

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">Article</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-9">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              {/* Post Image */}
              {post.image && imageMap[post.image] ? (
                <div className="w-full h-[450px] md:h-[550px] lg:h-[600px] bg-gray-100 overflow-hidden relative">
                  <img
                    src={imageMap[post.image]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="inline-block px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-full shadow-xl backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[450px] md:h-[550px] lg:h-[600px] bg-linear-to-br from-purple-100 to-purple-50 flex items-center justify-center relative">
                  <div className="absolute top-6 left-6">
                    <span className="inline-block px-5 py-2.5 text-sm font-semibold text-purple-700 bg-white rounded-full shadow-lg">
                      {post.category}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-20 h-20 text-purple-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              )}

              {/* Post Content */}
              <div className="p-8 md:p-12 lg:p-16 space-y-8">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{Math.floor(readingTime / 60)} {Math.floor(readingTime / 60) > 1 ? "minutes" : "minute"} and {readingTime % 60} {readingTime % 60 > 1 ? "seconds" : "second"} read</span>
                  </div>
                </div>

                {/* Full Content */}
                <div className="prose prose-lg prose-purple max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg md:text-xl space-y-6">
                    {post.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-6 text-gray-800">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Social Sharing & Actions */}
                <div className="pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Social Share Buttons */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700">Share:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: post.title,
                                text: post.excerpt,
                                url: window.location.href,
                              });
                            } else {
                              navigator.clipboard.writeText(window.location.href);
                              alert('Link copied to clipboard!');
                            }
                          }}
                          className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600 transition-colors"
                          aria-label="Share article"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Back Button */}
                    <button
                      onClick={() => navigate('/blog')}
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                      </svg>
                      Back to Blog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            {/* Author Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">About the Author</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-600">Content Writer</p>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Related Articles</h3>
                <div className="space-y-5">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        {relatedPost.image && imageMap[relatedPost.image] ? (
                          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-sm">
                            <img
                              src={imageMap[relatedPost.image]}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-linear-to-br from-gray-100 to-gray-50 shrink-0"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{relatedPost.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default BlogDetail;

