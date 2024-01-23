import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import { getDay } from '../common/date';
import BlogInteraction from '../components/blog-interaction.component';
import BlogPostCard from '../components/blog-post.component';
import BlogContent from '../components/blog-content.component';
import CommentsContainter, { fetchComments } from '../components/comments.component';
import LazyBlogContent from '../LazyComponents/lazyBlogContent';


export const blogStructure = {
  activity: {
    total_likes: 0,
    total_comments: 0,
    total_reads: 0,
    total_parent_comments: 0
  },
  blog_id: "",
  title: "",
  banner: "",
  description: "",
  content: [],

  author: {
    personal_info: {
      fullname: "",
      username: "",
      profile_img: ""
    },
  },
  publishedAt: ""
}


export const BlogContext = createContext({})

export default function BlogPage() {
  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  const [similarBlog, setSimilarBlog] = useState(null)
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentWrapper, setCommentWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);


  let { blog_id } = useParams();
  let { title, description, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog
  // console.log(tags);

  const fetchBlog = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
      .then(async ({ data: { blog } }) => {

        blog.comments = await fetchComments({ blog_id: blog._id, setParentCommentCountFun: setTotalParentCommentsLoaded })


        setBlog(blog);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tags: blog.tags[0], limit: 6, eliminate_blog: blog_id })
          .then(({ data }) => {

            setSimilarBlog(data.blogs)
          })

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    resetState();
    fetchBlog()
  }, [blog_id])

  function resetState() {
    setBlog(blogStructure)
    setSimilarBlog(null)
    setLoading(true);
    setIsLikedByUser(false)
    setCommentWrapper(false);
    setTotalParentCommentsLoaded(0)
  }

  return (

    <AnimationWrapper>

      {
        loading ?
        
        <LazyBlogContent/>
          :
          <BlogContext.Provider value={{ blog, setBlog, isLikedByUser, setIsLikedByUser, commentWrapper, setCommentWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded }} >

            <CommentsContainter />

            <div className=' max-w-[680px] center py-10 max-lg:px-[5vw] '>

              <img src={banner} className=' aspect-video' />


              <div className=' mt-12'>
                <h2>{title}</h2>

                <div className=' flex max-sm:flex-col justify-between my-8'>

                  <div className=' flex gap-5 items-start'>
                    <img src={profile_img} className='w-12 h-12 rounded-full' />

                    <p className=' capitalize'> {fullname}
                      <br />

                      @
                      <Link to={`/user/${author_username}`} className=' underline' > {author_username} </Link>
                    </p>

                  </div>

                  <p className=' text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'

                  >
                    Published on {getDay(publishedAt)}
                  </p>

                </div>

              </div>

              {/* user information ends here */}

              {/* user interaction start */}

              <BlogInteraction />

              {/* Blog Contents will go over here */}
              {/*  now start from 1:1:43 */}

              <div className='my-12 font-sourceSerif blog-page-content '>

                {
                  content[0].blocks.map((block, i) => {
                    return <div key={i} className='my-4 md:my-8'>
                      <BlogContent block={block} />

                    </div>
                  })
                }

              </div>


              <BlogInteraction />

              {/* Similar blogs */}

              {
                similarBlog != null && similarBlog.length ?
                  <>
                    <h1 className=' text-2xl mt-14 mb-10'>Similar Blogs</h1>

                    {
                      similarBlog.map((blog, i) => {
                        let { author: { personal_info } } = blog;

                        return (<AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>

                          <BlogPostCard content={blog} author={personal_info} />


                        </AnimationWrapper>)
                      })
                    }
                  </>
                  :
                  " "
              }


            </div>
          </BlogContext.Provider>
      }

    </AnimationWrapper>

  )
}



