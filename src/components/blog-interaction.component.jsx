import React, { useContext, useEffect } from 'react'
import { BlogContext } from '../pages/blog.page'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

export default function BlogInteraction() {

    let {blog, blog: {_id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog, isLikedByUser, setIsLikedByUser, setCommentWrapper } = useContext(BlogContext)

    let { userAuth : { data : { username, access_token}} } = useContext(UserContext)


    useEffect(()=>{
        if(access_token){
            // make request to server to get liked information
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { _id }, {
                headers : {
                    'Authorization' : `Bearer ${access_token}`
                }
            })
            .then(({data : { result }})=>{
                setIsLikedByUser(Boolean(result))

            })
            .catch(err=>{
                console.log(err);
            })
        }
    },[])


    const handelLike = ()=>
    {

        if(access_token){

            // like the blog time stamp { 2;32;14 }
            setIsLikedByUser(preVal => !preVal)

            !isLikedByUser ? total_likes++ : total_likes--;
            setBlog({...blog, activity : { ...activity, total_likes}})

            let like = isLikedByUser == true ? true : false;


            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id , isLikedByUser : like }, {
                headers : {
                    'Authorization' : `Bearer ${access_token}`
                }
            })
            .then(({data})=>{

            })
            .catch(err =>{
                console.log(err);
            })
        }   
        else{
            // not loged in 
            toast.error("Please login")
            //to improve it make like pop up login system
        }    
         
    }



    return (
        <>
        <Toaster/>
            <hr className=' border-grey my-2' />
            <div className=' flex gap-6 justify-between'>
                <div className=' flex gap-6 items-center'>
            {/* Like section */}

                        <button 
                        onClick={handelLike}
                        className={' w-10 h-10 flex items-center justify-center rounded-full pt-1 '+ ( isLikedByUser ? " bg-red/20 text-red":" bg-grey/80")}>
                            <i className={' fi '+(isLikedByUser ? 'fi-sr-heart ' : 'fi-rr-heart ' ) + ''}></i>
                        </button>


                        <p className=' text-xl text-dark-grey'>

                            {total_likes}
                        </p>

                    {/* Comments section */}
                        <button
                        onClick={()=>setCommentWrapper(preVal => !preVal)}
                         className=' w-10 h-10 rounded-full flex items-center justify-center pt-1 bg-grey/80'>
                            <i className=' fi fi-rr-comment-dots'></i>
                        </button>
 

                        <p className=' text-xl text-dark-grey'>

                            {total_comments}
                        </p>

                </div>

                <div className=' flex gap-6 items-center'>

                    {
                        username == author_username ?
                        <Link to={`/editor/${blog_id}`} 
                        className=' underline hover:text-purple'
                        >Edit</Link>
                        : ""
                    }

                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}>
                        <i className='fi fi-brands-twitter text-xl hover:text-twitter'></i>
                    </Link>

                </div>



            </div>

            <hr className=' border-grey my-2' />
        </>
    )
}
