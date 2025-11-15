import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../../api/Products";
import Loading from "../../components/Loading";
import Card from "../../components/Card";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProductById(id);
        if (mounted) setProduct(data);
        // Fetch related by category
        if (data?.category) {
          const rel = await getProductsByCategory(data.category);
          if (mounted)
            setRelated(rel.filter((p) => String(p.id) !== String(id)).slice(0, 8));
        } else if (mounted) {
          setRelated([]);
        }
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Loading message="Loading product..." fullScreen />;

  if (error || !product) {
    return (
      <section className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Product Not Found</h1>
            <p className="mb-6 text-gray-600">{error || "The product you are looking for does not exist."}</p>
            <Link to="/" className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700">Go Back Home</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-600 hover:text-purple-600 transition">Home</Link>
            </li>
            <li>
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">Product Details</span>
            </li>
          </ol>
        </nav>

        {/* Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Gallery */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="mx-auto h-96 w-full max-w-xl object-contain"
                />
              </div>
              {/* Thumbnails */}
              <div className="mt-3 grid grid-cols-3 gap-3">
                {[product.image, product.image, product.image].map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`flex items-center justify-center rounded-md border p-2 ${
                      activeImage === i ? "border-purple-600 ring-1 ring-purple-300" : "border-gray-200"
                    }`}
                  >
                    <img src={src} alt={`thumb-${i}`} className="h-16 w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 ${i < Math.round(product.rating?.rate ?? 0) ? "opacity-100" : "opacity-30"}`}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{product.rating?.rate ?? 0}</span>
                  <span className="text-xs text-gray-500"> ({product.rating?.count ?? 0} reviews)</span>
                </span>
              </div>

              {/* Price block */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-rose-600">${Number(product.price).toFixed(2)}</span>
                {typeof product.oldPrice === "number" && product.oldPrice > product.price && (
                  <span className="text-base text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
                )}
                {typeof product.discountPercent === "number" && product.discountPercent > 0 && (
                  <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Category badge */}
              <div>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200 capitalize">
                  {product.category}
                </span>
              </div>

              {/* Offer strip */}
              {product.offerText && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  {product.offerText}
                </div>
              )}

              {/* Quantity + actions */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-700 hover:bg-gray-50">-</button>
                  <span className="px-4 text-sm font-semibold text-gray-900">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} className="px-3 py-2 text-gray-700 hover:bg-gray-50">+</button>
                </div>
                <button type="button" className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                  Add to cart
                </button>
                <button type="button" className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                  Buy Now
                </button>
              </div>

              {/* Highlights / guarantees */}
              <div className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
                  Payment upon receipt of goods. Secure checkout supported.
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
                  Quality assurance. Consumer protection applies.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-6 text-sm">
              <button className="border-b-2 border-purple-600 px-1 py-2 font-semibold text-purple-600">Description</button>
              <button className="px-1 py-2 text-gray-600 hover:text-gray-900">Reviews</button>
            </nav>
          </div>
          <div className="prose prose-sm mt-4 max-w-none text-gray-700">
            <p>{product.description}</p>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Related products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {related.map((p) => (
                <Card
                  key={p.id}
                  id={p.id}
                  imageSrc={p.image}
                  title={p.title}
                  price={p.price}
                  rating={p.rating?.rate}
                  reviewCount={p.rating?.count}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
