import React, { useContext, useState } from 'react'
import { UserContext } from '../App';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { BlogContext } from '../pages/blog.page';

export default function CommentField({ action, index=undefined, replyingTo=undefined, setReplying }) {
    const [newArray, setNewArray]= useState();

    let { blog, blog: { _id, author: { _id: blog_author }, comments: { result: commentsArray }, activity, activity: { total_comments, total_parent_comments } }, comments, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext)

    const [comment, setComment] = useState("");

    let { userAuth: { data: { access_token, username, fullname, profile_img } } } = useContext(UserContext);

    const handelComment = () => {
        if (!access_token) {
            toast.error("Login to leave a comment"); 
            return
        }

        if (!comment.length) {
            toast.error("Write something");
            return
        }

        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
                _id,
                blog_author,
                comment,
                replying_to:replyingTo
            }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(({ data }) => {
                    // console.log(data);

                    setComment("");

                    data.commented_by = { personal_info: { username, profile_img, fullname } }

                    let newCommentArray;

                    if(replyingTo)
                    {

                        commentsArray[index].children.push(data._id);

                        data.childrenLevel = commentsArray[index].childrenLevel + 1;
                        data.parentIndex = index;

                        commentsArray[index].isReplyLoaded = true;

                        commentsArray.splice( index + 1,0, data)

                        newCommentArray = commentsArray;

                        setReplying(false);


                    }else
                    {
                        data.childrenLevel = 0;
    
                        newCommentArray = [data, ...commentsArray];
                        console.log("else newCArray",newCommentArray);
                    }
                  


                    let parentCommnentIncrementVal = replyingTo ? 1 : 0;


                    setBlog({ ...blog, comments: { ...comments, result: newCommentArray }, activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommnentIncrementVal } })

                    setTotalParentCommentsLoaded(preVal => preVal + parentCommnentIncrementVal)

                    if (data) {
                        toast.success("Commented successfully ✔")
                    }


                })
                .catch(err => {
                    console.log(err);
                })
        }
    }


    return (
        <>
            <Toaster />
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Leave a comment...'
                className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
            ></textarea>

            <button
                onClick={handelComment}
                className=' btn-dark mt-5 px-10'>
                {action}
            </button>
        </>

    )
}
