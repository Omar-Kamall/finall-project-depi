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

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogData.find((p) => p.id === parseInt(id));

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

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-purple-600 transition"
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
                className="text-gray-600 hover:text-purple-600 transition"
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

        {/* Article */}
        <article className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {/* Post Image */}
          {post.image && imageMap[post.image] ? (
            <div className="w-full h-96 bg-gray-100 overflow-hidden">
              <img
                src={imageMap[post.image]}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-20 h-20 text-gray-400"
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
          <div className="p-8 space-y-6">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900">
              {post.title}
            </h1>

            {/* Date and Author */}
            <div className="flex items-center text-sm text-gray-600 border-b border-gray-200 pb-6">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
            </div>

            {/* Full Content */}
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                {post.content}
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/blog')}
                className="inline-flex items-center px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
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
        </article>
      </div>
    </main>
  );
};

export default BlogDetail;

