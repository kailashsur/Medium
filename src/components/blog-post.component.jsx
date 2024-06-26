import React from 'react'
import { getDay } from '../common/date';
import { Link } from 'react-router-dom';

export default function BlogPostCard({ content, author}) {
    let { publishedAt, tags, title, description, banner, activity : {total_likes}, blog_id : id,  } = content;

    let { fullname, profile_img, username } = author; 

  return (
    <Link to={`/blog/${id}`} className=' flex gap-8 items-center border-b border-grey pb-5 mb-4 max-w-[680px]'>
    <div className=' w-full' >
        <div className='flex gap-2 items-center mb-4'>
            <img src={profile_img} className='w-6 h-6 rounded-full' />
            <p className=' line-clamp-1 text-sm '>{fullname} @{username}</p>
            <p className=' min-w-fit text-sm '> { getDay(publishedAt) } </p>
        </div>

        <h1 className=' blog-title '>{title}</h1>

        <p className=' my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{description}</p>

        <div className='flex gap-4 mt-7'>
            <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                <i className='fi fi-rr-heart text-sm' ></i>
                {total_likes}
            </span>
            <span className='btn-light py-1 px-4 text-sm'>{tags[0]}</span>
        </div>

    </div>

    <div className='h-28 aspect-square bg-grey'>
        <img src={banner} className='w-full h-full aspect-square object-cover' />

    </div>

    </Link>

  )
}
