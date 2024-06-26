import React from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';

export default function MinimalBlogPost({ blog, index }) {

    let { title, blog_id: id, author: { personal_info: { fullname, username, profile_img } }, publishedAt } = blog;

    return (
        <Link to={`/blog/${id}`} className='flex gap-5 mb-8 items-center w-full'>

            <h1 className='blog-index'>{index < 10 ? "0" + (index + 1) : index}</h1>

            <div className=' w-full'>
                <div className='flex gap-2 items-center mb-4 w-full '>
                    <img src={profile_img} className='w-6 h-6 rounded-full' />
                    <p className=' line-clamp-1 text-sm '>{fullname} @{username}</p>
                    <p className=' min-w-fit text-sm'> {getDay(publishedAt)} </p>
                </div>

                <h1 className='blog-title w-full'>
                    {title}
                </h1>
            </div>

        </Link>
    )
}
