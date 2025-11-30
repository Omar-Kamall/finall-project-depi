import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const totalPages = Math.ceil(blogData.length / postsPerPage);

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = blogData.slice(startIndex, endIndex);

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
              <span className="text-gray-900 font-medium">Blog</span>
            </li>
          </ol>
        </nav>

        {/* Blog Posts */}
        <div className="space-y-8">
          {currentPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Post Image */}
              {post.image && imageMap[post.image] ? (
                <div className="w-full h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={imageMap[post.image]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16 text-gray-400"
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
              <div className="p-6 space-y-4">
                {/* Category */}
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
                  {post.title}
                </h2>

                {/* Date and Author */}
                <div className="flex items-center text-sm text-gray-600">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                </div>

                {/* Excerpt */}
                <p className="text-gray-700 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Button */}
                <div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Blog;
