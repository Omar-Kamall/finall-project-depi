import React from 'react'
import Hero from './Hero'
import Quality from './Quality'
import Products from './Products'

const Home = () => {
  return (
    <main className='bg-gray-200'>
      <Hero />
      <Quality />
      <Products />
    </main>
  )
}

export default Home