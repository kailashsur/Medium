import React, { useContext } from 'react'
import { BlogContext } from '../pages/blog.page'
import CommentField from './comment-field.component';
import axios from 'axios';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {

    let res;


    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", { blog_id, skip })
        .then(({ data }) => {
            data.map(comment => {
                comment.childrenLevel = 0;
            })

            setParentCommentCountFun(preVal => preVal + data.length)

            if (comment_array == null) {

                res = { result: data }
            }
            else {
                res = { result: [...comment_array, ...data] }
            }
        })

    return res;
}

export default function CommentsContainter() {      // this is the default function ------------

    let {blog,
        blog:
        {
            _id,
            title, 
            comments: { result: commentsArray },
            activity : { total_parent_comments },
        },
        
        commentWrapper,
        setCommentWrapper,
        totalParentCommentsLoaded,
        setTotalParentCommentsLoaded,
        setBlog,
    } = useContext(BlogContext);
    // console.log(blog);


const loadmoreComments = async ()=>{

    let newCommentsArr = await fetchComments({skip : totalParentCommentsLoaded, blog_id : _id, setParentCommentCountFun : setTotalParentCommentsLoaded, comment_array : commentsArray})

    setBlog({...blog, comments: newCommentsArr})

}



    return (
        <div className={' max-sm:w-full fixed ' + (commentWrapper ? " top-0 sm:right-0 " : "top-[100%] sm:right-[-100%]") + ' duration-700 max-sm:right-0 sm:top-0 w-[30%] h-full min-w-[350px] z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden '}>

            <div className=' relative'>
                <h1 className=' text-xl font-medium'>
                    Comments
                </h1>
                <p
                    className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'
                > {title} </p>

                <button
                    onClick={() => setCommentWrapper(preVal => !preVal)}
                    className=' absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey  hover:text-black pt-1'>
                    <i className='fi fi-br-cross text-dark-grey hover:text-black'></i>
                </button>
            </div>

            <hr className=' border-grey my-8 w-[120%] -ml-10' />


            <CommentField action={"comment"} />

            {
                commentsArray && commentsArray.length ?
                    commentsArray.map((comment, i) => {
                        return <AnimationWrapper key={i}>

                            <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />

                        </AnimationWrapper>
                    })
                    : <NoDataMessage message={"No Comments"} />
            }

            {
                total_parent_comments > totalParentCommentsLoaded ?
                <button 
                onClick={loadmoreComments}
                className=' text-dark-grey p-2 hover:bg-grey/30 rounded-md flex items-center gap-2'>
                    Load More
                </button>
                :""
            }


        </div>
    )
}
