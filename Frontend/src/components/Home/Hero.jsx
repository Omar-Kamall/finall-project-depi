import React from 'react'
import { Link } from 'react-router-dom'
import hero from "../../Imgs/hero.png"

const Hero = () => {
  return (
    <section
        className="bg-purple-100 max-w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative overflow-hidden"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-white/80 to-transparent"></div>
        <div className="relative grid grid-cols-1 gap-10 items-center">
          <div className="max-w-2xl">
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4 animate-pulse">Weekend Discount</span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-purple-900 animate-fade-in">
              Shopping with us for better quality and the best price
            </h1>
            <p className="mt-5 text-gray-600 text-base sm:text-lg max-w-xl">
              We have prepared special discounts for you on grocery products. Don't miss these opportunities.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5">
              <Link 
                to="/category" 
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Shop Now
              </Link>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-rose-600">$21.67</span>
                <span className="text-gray-400 line-through">$26.67</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">Don't miss this limited time offer.</p>
          </div>
        </div>
      </section>
  )
}

export default Hero