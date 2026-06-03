import React from 'react'
import { categoriesData } from '../../assets/assets'
import { Link } from 'react-router-dom'

const HomeCategories = () => {
  return (
    <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            
            {/* Header Text Section */}
            <div>
                <h2 className='text-2xl font-semibold text-zinc-800'>Browse Categories</h2>
                <p className='text-sm text-app-text-light mt-1'>Find exactly what you need using categories</p>
            </div>
            
            {/* Horizontal Scrollable Categories Wrapper */}
            <div className='flex items-center mt-8 overflow-x-auto no-scrollbar gap-2'>
                {categoriesData.map((cat)=>(
                    <Link 
                        key={cat.slug} 
                        to={`/products?category=${cat.slug}`}
                        onClick={()=> window.scrollTo(0,0)} 
                        className='group flex flex-col items-center gap-3 p-4 shrink-0' // Added shrink-0 to prevent layout collapse
                    >
                        {/* Category Image Circle Container */}
                        <div className='size-16 sm:size-24 p-2 rounded-2xl overflow-hidden bg-orange-100 group-hover:ring-2 ring-orange-300/75 transition-all flex items-center justify-center'>
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className='w-full h-full object-contain rounded-full transition-all group-hover:scale-105'
                            />
                        </div>
                        
                        {/* Category Name label */}
                        <span className='text-xs font-medium text-zinc-600 text-center leading-tight max-w-[70px] sm:max-w-[96px] truncate'>
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>

        </div>
    </section>
  )
}

export default HomeCategories
