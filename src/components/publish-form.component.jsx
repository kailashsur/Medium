import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import { toast, Toaster } from 'react-hot-toast'
import { EditorContext } from '../pages/editor.pages'
import Tag from './tags.component';
import axios from 'axios';
import { UserContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';



export default function PublishForm() {
  let characterLimit = 200;
  const tagLimit = 10;

  let { blog_id } = useParams();

  let { blog, blog: { banner, title, tags, description, content }, setEditorState, setBlog } = useContext(EditorContext);

  let { userAuth : { data } } = useContext(UserContext)
  let { access_token } = data;

  let navigate = useNavigate();
  


  const handelCloseEvent = () => {
    setEditorState("editor")
  }

  const handelBlogTitleChange = (e) => {
    let input = e.target;

    setBlog({ ...blog, title: input.value })
  }

  const handelBlogDescriptionChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, description: input.value })
  }

  const handelTitleKeyDown = (e) => {

    if (e.keyCode == 13) { // user have pressed enter key
      e.preventDefault()
    }
  }

  const handelKeyDown = (e) => {
    // console.log(e);
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      let tag = e.target.value;
      // console.log(tag);
      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] })
        }
      } else {
        toast.error(` You have used maximum tags limit ${tagLimit}`)
      }

      e.target.value = "";
    }
  }


  const publishBlog = (e) => {

    if(e.target.className.includes("disable")){
      return
    }

    if(!title.length){
      return toast.error("Write title")
    }
    if(!description.length || description.length > characterLimit){
      return toast.error(`Write a description under character limit ${characterLimit}`)
    }
    if(!tags.length){
      return toast.error("Please add tag");
    }

    let loadingToast = toast.loading("Publishing...");

    
    // desable this button
    e.target.classList.add('disable');


    let blogObj = {
    title, banner, description, content, tags, draft : false
    }
    axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/create-blog", {...blogObj, id:blog_id}, {
      headers : {
        'Authorization' : `Bearer ${access_token}` 
      }
    })
    .then(()=>{
      e.target.classList.remove('disable');
      toast.dismiss(loadingToast);
      toast.success("Published ✔");
      
      setTimeout(()=>{
        // we will change it to dashboard later
        navigate("/");
      }, 2000)
    })
    .catch(({ responce }) =>{
      e.target.classList.remove('disable');
      toast.dismiss(loadingToast);

      return toast.error(responce.data.error)

    })
    
  }


  return (
    <AnimationWrapper>
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4' >

        <Toaster />

        <button className=' w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%] '
          onClick={handelCloseEvent}
        >
          <i className='fi fi-br-cross'></i>
        </button>

        <div className='max-w-[550px] center' >
          <p className='text-dark-grey mb-1'>
            Preview
          </p>

          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <img src={banner} alt="" />
          </div>

          <h1 className=' text-4xl font-medium mt-2 leading-tight line-clamp-2'
          >{title}</h1>

          <p className=' font-gelasio line-clamp-2 text-xl leading-7 mt-4'>
            {description}
          </p>


        </div>


        <div className=' border-grey lg:border-1 lg:pl-8'>
          <p className=' text-dark-grey mb-2 mt-9'>Blog Title</p>
          <input type="text" placeholder='Blog Title' defaultValue={title}
            className=' input-box pl-4'
            onChange={handelBlogTitleChange}
          />


          <p className=' text-dark-grey mb-2 mt-9'>Sort description</p>
          <textarea
            onChange={handelBlogDescriptionChange}
            maxLength={characterLimit}
            defaultValue={description}
            onKeyDown={handelTitleKeyDown}
            className='h-40 resize-none leading-7 input-box pl-4'
          ></textarea>

          <p
            className='mt-1 text-dark-grey text-sm text-right'
          >{characterLimit - description.length} character left</p>


          <p
            className=' text-dark-grey mb-2 mt-9'
          >Topics -( Helps is searching and ranking)</p>

          <div className=' relative input-box pl-2 py-2 pb-4' >
            <input type="text" placeholder='Topics' className='s ticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white'
              onKeyDown={handelKeyDown}
            />

            {
              tags.map((tag, i) => {
                return <Tag tag={tag} tagIndex={i} key={i} />

              })
            }


          </div>

          <p className='mt-1 mb-4 text-dark-grey text-right text-sm'>
            {tagLimit - tags.length} Tags left
          </p>

          <button className='btn-dark px-8 '
            onClick={publishBlog}
          >
            Publish
          </button>

        </div>
      </section>
    </AnimationWrapper>
  )
}
