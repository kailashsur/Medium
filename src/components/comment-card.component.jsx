import React, { useContext, useState } from 'react'
import { getDay } from '../common/date';
import { UserContext } from '../App';
import toast from 'react-hot-toast';
import CommentField from './comment-field.component';
import { BlogContext } from '../pages/blog.page';
import axios from 'axios';

// TODO:  I will fix and rebuild the comment system later with the tree data structure with separet component ,,,, starting from the time stapm is 23:20 part 5 video

export default function CommentCard({ index, leftVal, commentData }) {

    const [isReplying, setReplying] = useState(false);

    let { commented_by: { personal_info: { profile_img, username: commented_by_username, fullname } }, commentedAt, comment, _id, children } = commentData;

    let { userAuth: { data: { access_token, username } } } = useContext(UserContext);

    let { blog, blog: { comments, activity, activity: { total_parent_comments }, comments: { result: commentsArray }, author: { personal_info: { username: blog_author } } }, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext);

    function getParentIndex() {
        let startingPoint = index - 1;

        try {

            while (commentsArray[startingPoint].childrenLevel >= commentData.childrenLevel) {
                startingPoint--;
            }

        } catch {
            startingPoint = undefined;
        }

        return startingPoint;
    }


    function removeCommentsCards(startingPoint, isDelete = false) {
        if (commentsArray[startingPoint]) {
            while (commentsArray[startingPoint].childrenLevel > commentData.childrenLevel) {
                commentsArray.splice(startingPoint, 1);

                if (!commentsArray[startingPoint]) {
                    break;
                }
            }
        }

        if (isDelete) {
            let parentIndex = getParentIndex();

            if (parentIndex != undefined) {
                commentsArray[parentIndex].children = commentsArray[parentIndex].children.filter(child => child != _id)

                if (commentsArray[parentIndex].children.length) {
                    commentsArray[parentIndex].isReplyLoaded = false;
                }
            }

            commentsArray.splice(index, 1);
        }
        if (commentData.childrenLevel == 0 && isDelete) {
            setTotalParentCommentsLoaded(preVal => preVal - 1)
        }

        setBlog({ ...blog, comments: { result: commentsArray }, activity: { ...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0) } })
    }


    function loadRepies({ skip = 0, currentIndex = index }) {

        if (commentsArray[currentIndex].children.length) {
            hideRepies();

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", { _id: commentsArray[currentIndex]._id, skip })
                .then(({ data: { replies } }) => {
                    // console.log("data replies : ", data);
                    commentsArray[currentIndex].isReplyLoaded = true;

                    for (let i = 0; i < replies.length; i++) {
                        replies[i].childrenLevel = commentsArray[currentIndex].childrenLevel + 1;

                        commentsArray.splice(currentIndex + 1 + i + skip, 0, replies[i])
                    }
                    setBlog({ ...blog, comments: { ...comments, result: commentsArray } })
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const deleteComment = (e) => {
        e.target.setAttribute("disabled", true)

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", { _id }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(() => {
                e.target.removeAttribute("disable")
                removeCommentsCards(index + 1, true);

                toast.success("Deleted")
            })
            .catch(err => { console.log(err) })
    }

    function hideRepies() {
        commentData.isReplyLoaded = false;

        removeCommentsCards(index + 1);
    }


    const handelReplayClick = () => {

        if (!access_token) {
            return toast.error("Login to replay");
        }
        else {
            setReplying(preVal => !preVal)
        }
    }


    // this is Load More component
    const LoadMoreRepliesButton = () => {

        let parentIndex = getParentIndex();

        const buttonjsx = <button
        onClick={loadRepies({skip : index - parentIndex, currentIndex:parentIndex })}
        className=' text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
        >Load More</button>

        if(commentsArray[index+1]){
            if(commentsArray[index+1].childrenLevel < commentsArray[index].childrenLevel){

                // if(index - parentIndex < commentsArray[parentIndex].children.length){

                // }
                return buttonjsx;
                
            }
        }else{
            if(parentIndex){
                // if(index - parentIndex < commentsArray[parentIndex].children.length){
    
                // }
                return buttonjsx;

            }
        }
        
        
    }


    return (
        <>

            <div className=' w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>

                <div className=' my-5 p-6 rounded-md border border-grey'>
                    <div className=' flex gap-3 items-center mb-8 '>
                        <img src={profile_img} className=' w-6 h-6 rounded-full' />

                        <p className=' line-clamp-1 text-sm'> {fullname} @{commented_by_username} </p>
                        <p className=' min-w-fit text-sm'> {getDay(commentedAt)} </p>

                    </div>

                    <p className=' font-gelasio text-base ml-3'>
                        {comment}
                    </p>

                    <div className=' flex gap-5 items-center mt-5'>

                        {
                            commentData.isReplyLoaded ?
                                <button
                                    onClick={hideRepies}
                                    className=' text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>
                                    <i className='fi fi-rs-comment-dots'></i>Hide reply
                                </button>
                                :
                                <button
                                    onClick={loadRepies}
                                    className=' text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>
                                    <i className='fi fi-rs-comment-dots'></i>
                                    {children.length} Reply
                                </button>
                        }

                        <button
                            onClick={handelReplayClick}
                            className=' underline'>
                            Reply
                        </button>

                        {
                            username == commented_by_username || username == blog_author ?
                                <button
                                    onClick={deleteComment}
                                    className='p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center'>
                                    <i className='fi fi-rr-trash pointer-events-none'></i>
                                </button>
                                : ""
                        }

                    </div>

                    {
                        isReplying ?
                            <div className=' mt-8'>
                                <CommentField action="reply" index={index} replyingTo={_id}
                                    setReplying={setReplying}
                                />
                            </div>
                            : ""
                    }




                </div>

                {/* <LoadMoreRepliesButton /> */}

            </div>
        </>
    )
}
