import React, { useContext, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Logo from '../imgs/logo.png'
import AnimationWrapper from '../common/page-animation'
import defaultBanner from '../imgs/blog banner.png'
import { uploadImage } from '../common/aws'
import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from '../pages/editor.pages'
import EditorJS from '@editorjs/editorjs'
import { Tools } from './tools.component'
import axios from 'axios'
import { UserContext } from '../App'


export default function BlogEditor() {

    const navigate = useNavigate()

    // let blogBannerRef = useRef();
    let { blog, blog: { title, banner, content, tags, description }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
    let { blog_id } = useParams();

    let { userAuth, userAuth : { data }} = useContext(UserContext)
    let access_token = data.access_token;

    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holder: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: Tools,
                placeholder: "Let's write an awsome story",
            }))
        }
    }, [])


    const handelBannerUpload = (e) => {
        // console.log(e.target.files[0]);
        let img = e.target.files[0];
        // console.log(img);

        if (img) {
            let loadingToast = toast.loading("Uploading...")

            uploadImage(img).then((url) => {
                if (url) {
                    toast.dismiss(loadingToast);
                    toast.success("Uploaded 👍")
                    // blogBannerRef.current.src = url;


                    setBlog({ ...blog, banner: url })
                }
            })
                .catch(err => {
                    toast.dismiss(loadingToast);
                    return toast.error(err);
                })
        }
    }

    const handelTitleKeyDown = (e) => {
        // console.log(e);

        if (e.keyCode == 13) { // user have pressed enter key
            e.preventDefault()
        }
    }

    const handelTitleChange = (e) => {
        // console.log(e);
        let input = e.target;
        // console.log(input.scrollHeight);
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";

        setBlog({ ...blog, title: input.value })
    }

    const handelBannerError = (e) => {
        let img = e.target;
        img.src = defaultBanner;
    }

    const handelPublishEvent = () => {

        if (!banner.length) {
            return toast.error("Upload a Blog Banner")
        }
        if (!title.length) {
            return toast.error("Write a Blog Title")
        }

        if (textEditor.isReady) {
            textEditor.save().then(data => {
                // console.log(data);
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data });
                    setEditorState("publish")
                } else {
                    return toast.error("Write somthing in blog")
                }
            })
                .catch(err => {
                    console.log(err);
                })
        }

    }


    const handelSaveDraft = (e) => {

        if (e.target.className.includes("disable")) {
            return;
        }

        if (!title.length) {
            return toast.error("Write title to draft")
        }
         

        let loadingToast = toast.loading("Saving Draft...");


        // desable this button
        e.target.classList.add('disable');


        if(textEditor.isReady){
            textEditor.save().then(content =>{

                let blogObj = {
                    title, banner, description, content, tags, draft: true
                } 
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj, id: blog_id}, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })   
                    .then(() => {
                        e.target.classList.remove('disable');
        
                        toast.dismiss(loadingToast);
                        toast.success("Saved ✔");
        
                        setTimeout(() => {
                            // we will change it to dashboard later
                            navigate("/");
                        }, 2000)
                    })
                    .catch(({ responce }) => {
                        e.target.classList.remove('disable');
                        toast.dismiss(loadingToast);
        
                        return toast.error(responce.data.error)
        
                    })
            })
        }



    }

    return (
        <>
            <nav className='navbar '>
                <Link to="/" className='flex-none w-10 ' >
                    <img src={Logo} />
                </Link>

                <p className=' max-md:hidden text-black line-clamp-1 w-full '>
                    {title.length ? title : "New Blog"}
                </p>

                <div className=' flex gap-4 ml-auto' >

                    <button className='btn-dark py-2'
                        onClick={handelPublishEvent}
                    >
                        Publish
                    </button>

                    <button className='btn-light py-2'
                        onClick={handelSaveDraft}
                    >
                        Save Draft
                    </button>

                </div>
            </nav>
            <Toaster />
            <AnimationWrapper>
                <section>
                    <div className='mx-auto max-w-[900px] w-full '>
                        {/* Banner Uploading secction start */}
                        <div className=" relative aspect-video bg-white border-4 border-grey hover:opacity-80" >
                            <label htmlFor='uploadBanner'>
                                <img
                                    // ref={blogBannerRef}
                                    src={banner}
                                    onError={handelBannerError}
                                    className=' z-20'

                                />
                                <input
                                    type="file"
                                    id="uploadBanner"
                                    accept='.png, .jpg, .jpeg'
                                    hidden
                                    onChange={handelBannerUpload}
                                />
                            </label>
                        </div>
                        {/* banner ends */}

                        {/* Title start */}
                        <textarea
                            defaultValue={title}
                            placeholder='Blog Title'
                            className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 '
                            onKeyDown={handelTitleKeyDown}
                            onChange={handelTitleChange}
                        >

                        </textarea>
                        {/* title ends */}

                        <hr className='w-full opacity-10 my-5' />


                        {/* Text editor pannel starts */}

                        <div id="textEditor" className=' font-gelasio' >
                        </div>

                        {/* text editor ends here */}

                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}
