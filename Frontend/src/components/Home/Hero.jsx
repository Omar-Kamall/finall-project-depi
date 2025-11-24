import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllProducts } from '../../api/Products'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loading from '../Loading'

const Hero = () => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const fetchRandomProduct = async () => {
      try {
        setLoading(true)
        const products = await getAllProducts()
        if (products && products.length > 0) {
          // Get a random product
          const randomIndex = Math.floor(Math.random() * products.length)
          setProduct(products[randomIndex])
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRandomProduct()
  }, [])

  const handleAddToCart = async () => {
    if (!product || adding) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      showError("Please login to add items to cart")
      navigate("/account/login")
      return
    }
    
    setAdding(true)
    try {
      await addToCart(
        { id: product.id, price: product.price, title: product.title, image: product.image },
        1
      )
      success(`${product.title} added to cart!`)
    } catch {
      showError('Failed to add item to cart. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-purple-100 max-w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-h-[60vh] max-h-[80vh] flex items-center">
        <div className="container mx-auto">
          <Loading message="Loading featured product..." />
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="bg-purple-100 max-w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-h-[60vh] max-h-[80vh] flex items-center">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-gray-600">No product available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  const rating = product.rating?.rate || 0
  const reviewCount = product.rating?.count || 0

  return (
    <section className="bg-purple-100 max-w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-h-[60vh] max-h-[85vh] overflow-hidden">
      <div className="container mx-auto h-full">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center h-full min-h-[50vh] lg:min-h-[60vh]">
          {/* Mobile: Image as background with overlay text */}
          <div className="lg:hidden relative w-full h-full min-h-[50vh] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-white rounded-lg shadow-lg">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                </div>
              )}
              <Link to={`/product/${product.id}`}>
                <div className="relative w-full h-full bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.title}
                    onLoad={() => setImageLoaded(true)}
                    className={`h-full w-full object-contain object-center ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              </Link>
            </div>
            {/* Overlay content on mobile */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-4 rounded-lg">
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-2 w-fit">
                Featured Product
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold leading-tight text-white mb-2 line-clamp-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`h-4 w-4 ${
                        i < Math.round(rating) ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-white/90">
                  {rating.toFixed(1)} ({reviewCount})
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-2xl font-bold text-white">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold shadow-sm hover:bg-purple-700 transition-all duration-200"
                >
                  View Details
                </Link>
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1 h-4 w-4"
                  >
                    <path d="M2.25 3.75h2.386c.7 0 1.311.48 1.468 1.163l.23 1.011m0 0l1.204 5.3A2.25 2.25 0 009.733 12h7.286a2.25 2.25 0 002.192-1.684l1.006-4.019A1.125 1.125 0 0019.131 4.5H6.334m0 0l-.23-1.011A2.25 2.25 0 003.636 2.25H2.25M6 20.25a.75.75 0 100-1.5.75.75 0 000 1.5zm12.75 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  </svg>
                  {adding ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop: Left Section - Product Details */}
          <div className="hidden lg:block">
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
              Featured Product
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight text-purple-900 mb-3 line-clamp-2">
              {product.title}
            </h1>
            <p className="text-gray-600 text-base mb-4 line-clamp-2">
              {product.description || 'Discover this amazing product with exceptional quality and great value.'}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-4 w-4 ${
                      i < Math.round(rating) ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>

            {/* Price and Actions */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-rose-600">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/product/${product.id}`}
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold shadow-sm hover:bg-purple-700 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                View Details
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M2.25 3.75h2.386c.7 0 1.311.48 1.468 1.163l.23 1.011m0 0l1.204 5.3A2.25 2.25 0 009.733 12h7.286a2.25 2.25 0 002.192-1.684l1.006-4.019A1.125 1.125 0 0019.131 4.5H6.334m0 0l-.23-1.011A2.25 2.25 0 003.636 2.25H2.25M6 20.25a.75.75 0 100-1.5.75.75 0 000 1.5zm12.75 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                </svg>
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {/* Desktop: Right Section - Product Image */}
          <div className="hidden lg:block">
            <div className="relative bg-white rounded-lg shadow-lg p-4 lg:p-6 overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                </div>
              )}
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-square w-full max-w-sm mx-auto bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    onLoad={() => setImageLoaded(true)}
                    className={`h-full w-full object-contain object-center transition-transform duration-300 hover:scale-110 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero