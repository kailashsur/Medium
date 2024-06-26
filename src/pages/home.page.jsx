import React, { useEffect, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation, { activeTabRef } from '../components/inpage-navigation.component'
import axios from 'axios'
import Loader from '../components/loader.component';
import BlogPostCard from '../components/blog-post.component';
import MinimalBlogPost from '../components/nobanner-blog-post.component';
import NoDataMessage from '../components/nodata.component';
import { filterPaginationData } from '../common/filter-pagination-data';
import LoadmoreDataBtn from '../components/load-more.component';
import LazyBlogPost from '../LazyComponents/lazyBlogPost';

export default function HomePage() {
    const categories = ["programming", "travel", "biography", "tech"];


    let [blogs, setBlogs] = useState(null);


    let [trendingBlogs, setTrendingBlogs] = useState(null);
    let [pageState, setPageState] = useState("home");


    /**
     * The blogs state contain this type of data
     
                {
                    results : [{}, {}, {},...],
                    totalDocs : 10...
                }

     */


    const fetchLatestBlogs = ({ page = 1 }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
            .then(async ({ data }) => {
                // console.log(data.blogs);

                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/all-latest-blogs-count"
                })

                // console.log(formatedData);
                // setNewBlogsState(formatedData)
                setBlogs(formatedData)
            })
            .catch(err => {
                console.log(err);
            })

    }


    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
            .then(({ data: { blogs } }) => {
                setTrendingBlogs(blogs)
            })
            .catch(err => {
                console.log(err);
            })

    }

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();

        setBlogs(null);

        if (pageState == category) {
            setPageState("home");
            return
        }

        setPageState(category);

    }

    const fetchBlogsByCategory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tags: pageState, page })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { tags: pageState }
                })

                setBlogs(formatedData)

            }).catch(err => {
                console.log(err);
            })

    }


    useEffect(() => {

        // activeTabRef.current.click();

        if (pageState == "home") {
            fetchLatestBlogs({ page: 1 });
        } else {
            fetchBlogsByCategory({ page: 1 });
        }



        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }

    }, [pageState])


    return (
        <AnimationWrapper>

            <section className=' h-cover flex flex-col md:flex-row justify-center gap-10 w-full ' >
                <div className=' md:max-w-[1200px] flex flex-col md:flex-row'>


                    {/* Latest Blogs */}
                    <div className='w-full'>

                        {/* <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]} > */}


                        <>
                            {
                                blogs == null ?
                                    //  <Loader /> 

                                    //----------------Lazy load start------------------------------------
                                    <>
                                        <LazyBlogPost />
                                        <LazyBlogPost />
                                        <LazyBlogPost />
                                        <LazyBlogPost />
                                        <LazyBlogPost />
                                    </>
                                    //----------------Lazy load end------------------------------------

                                    :


                                    (
                                        blogs.results.length ?

                                            blogs.results.map((blog, i) => {
                                                // return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }} >
                                                return <BlogPostCard key={i} content={blog} author={blog.author.personal_info} />
                                                // </AnimationWrapper>
                                            })
                                            : <NoDataMessage message={"No Blogs Found"} />
                                    )
                            }

                            <LoadmoreDataBtn state={blogs} fetchDataFun={(pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory)} />
                        </>


                        {/* {
                            trendingBlogs == null ? <Loader /> :
                                (
                                    trendingBlogs.length ?
                                        trendingBlogs.map((blog, i) => {
                                            return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }} >
                                                <MinimalBlogPost blog={blog} index={i} />
                                            </AnimationWrapper>
                                        })
                                        : <NoDataMessage message={"Blogs not exist"} />
                                )
                        } */}

                        {/* </InPageNavigation> */}

                    </div>

                    {/* for filter and trendigg= */}

                    <div className=' md:min-w-[300px] border-l border-grey pl-8 pt-3 flex flex-col md:flex-row'>

                        <div className='flex flex-col gap-10  '>

                            <div >
                                <h1 className='font-medium text-xl mb-8'>Stories from all interest</h1>

                                <div className=' flex gap-3 flex-wrap'>
                                    {
                                        categories.map((category, i) => {
                                            return <button className={` tag text-sm ` + (pageState == category ? "  bg-black text-white" : " ")} key={i}
                                                onClick={loadBlogByCategory}
                                            >
                                                {category}
                                            </button>
                                        })
                                    }

                                </div>
                            </div>



                            <div className=' w-full'>
                                <h1 className='font-medium text-xl mb-8'>
                                    Trending <i className='fi fi-rr-arrow-trend-up'></i>
                                </h1>

                                {
                                    trendingBlogs == null ? <Loader /> :
                                        (
                                            trendingBlogs.length ?
                                                trendingBlogs.map((blog, i) => {
                                                    return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }} >
                                                        <MinimalBlogPost blog={blog} index={i} />
                                                    </AnimationWrapper>
                                                })

                                                : <NoDataMessage message={"No Blogs Found"} />
                                        )
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </AnimationWrapper>
    )
}
