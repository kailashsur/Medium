import React from 'react'

export default function LazyBlogPost() {
    return (
        <div role="status" className=' max-w-[680px] flex gap-8 items-center border-b border-grey pb-5 mb-4 animate-pulse'>
            <div className=' w-full' >
                <div className='flex gap-2 items-center mb-4'>
                    <div className=' bg-grey w-6 h-6 rounded-full'></div>
                    <div className=' bg-grey w-20 h-3'></div>
                    <div className=' bg-grey w-20 h-3 '></div>
                </div>

                <div className=' bg-grey w-full h-7 rounded-full'></div>
                <div className=' bg-grey w-full h-7 mt-2 rounded-full '></div>

                <div className=' bg-grey my-3 max-sm:hidden md:max-[1100px]:hidden w-full h-20'></div>

                <div className='flex gap-4 mt-7'>
                    <span className='ml-3 flex items-center bg-grey'>
                        <div className=' bg-grey h-4 w-4 rounded-full' ></div>
                    </span>
                    <span className=' bg-grey h-4 w-6 rounded-full py-1 px-4'></span>
                </div>

            </div>

            <div className='h-28 aspect-square bg-grey'>
                <div className='w-full h-full bg-grey'></div>

            </div>

        </div>
    )
}
