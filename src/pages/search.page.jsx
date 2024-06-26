import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InPageNavigation from '../components/inpage-navigation.component';
import Loader from '../components/loader.component';
import AnimationWrapper from '../common/page-animation';
import BlogPostCard from '../components/blog-post.component';
import NoDataMessage from '../components/nodata.component';
import LoadmoreDataBtn from '../components/load-more.component';
import axios from 'axios';
import { filterPaginationData } from '../common/filter-pagination-data';
import UserCard from '../components/usercard.component';

export default function SearchPage() {
    let { query } = useParams();
    const [blogs, setBlogs] = useState(null)
    const [users, setUsers] = useState(null)


    const searchBlogs = ({ page = 1, create_new_arr = false }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
            .then(async ({ data }) => {
                // console.log(data.blogs);

                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { query },
                    create_new_arr
                })

                setBlogs(formatedData);
            })
            .catch(err => {
                console.log(err);
            })
    }


    const fetchUsers = async () => {
        try {
            //{ data: { users } }
            let { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
            let { users } = data;

            setUsers(users);
        } catch (error) {

        }

    }


    useEffect(() => {
        resetState();
        searchBlogs({ page: 1, create_new_arr: true })
        fetchUsers();

    }, [query])


    function resetState() {
        setBlogs(null)
        setUsers(null);
    }

    const UserCardWrapper = ()=>{
        return (
            <>
            {
                users == null ? <Loader />
                : users.length ?
                users.map((user, i)=>{
// console.log(user.personal_info.fullname);
                    return <AnimationWrapper key={i} transition={ { duration : 1, delay : i*0.08}} >
                        <UserCard user={user}/>

                    </AnimationWrapper>

                })
                : <NoDataMessage message="No users found"/>
            }
            </>
        )
    }

    return (
        <section className='h-cover flex justify-center gap-10'>

            <div className=' w-full '>
                <InPageNavigation routes={[`Search for "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]} >

                    <>
                        {
                            blogs == null ? <Loader /> :
                                (
                                    blogs.results.length ?

                                        blogs.results.map((blog, i) => {
                                            return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }} >
                                                <BlogPostCard content={blog} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        })
                                        : <NoDataMessage message={"No Blogs Found"} />
                                )
                        }
                        <LoadmoreDataBtn state={blogs} fetchDataFun={searchBlogs} />

                    </>

                    <UserCardWrapper />



                </InPageNavigation>

            </div>


            <div className=' min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden' >

                <h1 className=' font-medium text-xl mb-8'>Users related to search 
                <i className='fi fi-rr-user m-1 text-xl font-bold'></i>
                </h1>

                <UserCardWrapper/>
            </div>

        </section>
    )
}
