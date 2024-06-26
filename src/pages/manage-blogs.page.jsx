import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { filterPaginationData } from '../common/filter-pagination-data';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function ManageBlogs() {
  const { userAuth: { data: { access_token } } } = useContext(UserContext);

  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('Published'); // Added activeTab state
  const [selectedPosts, setSelectedPosts] = useState([]);


  const getBlogs = ({ draft }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + `/user-posts`, { draft }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(({ data: { blogs } }) => {
        setBlogs(blogs);
        // console.log(blogs);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deletePost = ({ blog_id }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-user-post", { blog_id }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(() => {
        // Create a new array with the post removed
        const updatedBlogs = blogs.filter(blog => blog.blog_id !== blog_id);
        setBlogs(updatedBlogs);
        return toast.success("Deleted ✔");
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    // Load initial data when the component mounts
    getBlogs({ draft: false });
  }, []);

  const handleTabClick = (tabName, draftValue) => {
    setActiveTab(tabName);
    getBlogs({ draft: draftValue });
  };

  const handlePostSelection = (blogId) => { }

  return (
    <section className='w-full'>
      <Toaster />
      <div className='flex flex-row justify-between'>
        <div className='top-0 flex gap-4 items-start w-full h-fit border-b border-grey pb-4'>

          <div
            className={`pb-2 cursor-pointer ${activeTab === 'Published' ? 'border-b border-dark-grey' : ''}`}
            onClick={() => {
              handleTabClick('Published', false)

            }}
          >
            Published
          </div>
          <div
            className={`pb-2 cursor-pointer ${activeTab === 'Draft' ? 'border-b border-dark-grey' : ''}`}
            onClick={() => {
              handleTabClick('Draft', true)

            }}
          >
            Draft
          </div>
        </div>

        <Link to={"/editor"} className='flex flex-row'><i className="fi fi-rr-add-document hover:text-purple "></i></Link>

      </div>
      {/* Render your blogs or other content based on the active tab */}

      <div className=' h-full w-full flex flex-col gap-6 mt-10'>
        {
          access_token ? blogs.length > 0 ?
            blogs.map(({
              title,
              banner,
              publishedAt,
              blog_id,
              activity: { total_likes, total_comments, total_reads },
              author: { personal_info: { fullname, profile_img, username } }
            }, i) => {
              return <div key={i} className=' flex items-center'>

                <div className=' h-full w-full py-4 px-4 flex flex-col border border-dark-grey/30 rounded-md'>
                  <div className=' flex flex-row justify-between'>
                    <div className='line-clamp-1'> {title} </div>

                    <img src={banner} alt="" className='w-12 h-12 aspect-square object-cover' />
                  </div>

                  <div className='flex flex-row justify-between items-baseline mt-6'>
                    <div className=' flex flex-row gap-4 items-center'>

                      <div className='flex gap-2 items-center'>
                        <span className=' text-sm'>Views</span>
                        <span className='text-sm'> {total_reads} </span>
                      </div>

                      <div className='flex gap-2 items-center'>
                        <svg className='text-sm' width="20" height="20" viewBox="0 0 24 24" aria-label="clap"><path fillRule="evenodd" clipRule="evenodd" d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"></path></svg>
                        <span className=' text-sm'> {total_likes} </span>
                      </div>

                      <div className='flex gap-2 items-center '>
                        <svg className='text-sm' width="20" height="20" viewBox="0 0 24 24" ><path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path></svg>
                        <span className='text-sm'> {total_comments} </span>
                      </div>
                    </div>

                    <div className=' flex gap-4'>
                      {
                        activeTab == "Draft" ?
                          <Link className=' text-sm hover:text-purple'
                            to={`/blog/${blog_id}`}
                          >Preview</Link>
                          :
                          <Link className=' text-sm hover:text-purple'
                            to={`/blog/${blog_id}`}
                          >View</Link>
                      }

                      <Link className=' text-sm underline hover:text-purple'
                        to={`/editor/${blog_id}`}
                      >Edit</Link>

                      <button className=' text-sm hover:text-purple '
                        onClick={(e) => {
                          e.preventDefault();
                          deletePost({ blog_id })
                        }}
                      >Delete</button>
                    </div>
                  </div>

                </div>
              </div>

            })
            :
            <div className=' mt-6 bg-grey px-4 py-2 rounded-full text-center'>
              No Post Found
            </div>
            : ""
        }
      </div>
    </section>
  );
}
