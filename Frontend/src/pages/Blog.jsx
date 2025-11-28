const Blog = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-gray-600 mb-8">
            Stay updated with the latest news, tips, and insights from JinStore.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600">
              We're working on bringing you amazing content. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Blog;

