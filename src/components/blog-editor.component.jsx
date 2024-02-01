import React, { useContext, useEffect, useRef, useState } from 'react'
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
import UserLib from './user-lib.components'


export default function BlogEditor() {

    const navigate = useNavigate()

    // let blogBannerRef = useRef();
    let { blog, blog: { title, banner, content, tags, description }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
    let { userAuth, userAuth: { data } } = useContext(UserContext)
    let access_token = data.access_token;

    const [showLib, setShowLib] = useState(false);

    let { blog_id: url_id } = useParams();
    const [blog_id, setBlogId] = useState(url_id);
    const [slug, setSlug] = useState(undefined);

    let slug_ref = useRef();


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

    const hendelOpenLib = () => {
        setShowLib(true)
        // UserLib({setShowLib});
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


    //-------------------slug setup -----------------
    const HandelSlugUpdate = (e) => {
        let new_blog_id = slug_ref.current.value;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-slug", { blog_id: url_id, new_blog_id }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(() => {

                toast.success("Slug Changed")

                setTimeout(() => {
                    navigate("/");
                }, 2000)
            })
            .catch(err => {
                e.target.classList.remove('desable')
                toast.error("Something went wrong");
            })
    }

    const HandelSlugSet = (e) => {
        setSlug(slug_ref.current.value)
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


        if (textEditor.isReady) {
            textEditor.save().then(content => {

                let blogObj = {
                    title, banner, description, content, tags, draft: true
                }
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id, slug: slug }, {
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
                <section className="md:grid md:grid-cols-3 md:gap-4">
                    <div className='mx-auto max-w-[680px] w-full md:col-span-2 '>

                        {
                            showLib ? <UserLib setShowLib={setShowLib} /> : ""
                        }

                        {/* Banner Uploading secction start */}
                        <div className=" relative aspect-video bg-white border-4 border-grey hover:opacity-80" >
                            <label htmlFor='uploadBanner'>
                                <img
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
                        <div className=' flex justify-center items-center h-5 mt-5 text-dark-grey font-bold'>
                            Or
                        </div>

                        <div className=" mt-5 py-5 flex justify-center items-center bg-white border-4 border-grey hover:opacity-80 cursor-pointer"
                            onClick={hendelOpenLib}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-dark-grey">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>

                            <span className=' ml-5 text-xl font-bold text-dark-grey'> Open Library </span>

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

                    //-------------Mobile view of settings
                    <div className=' md:hidden fixed top-40 right-0 p-1 bg-black text-white '>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                    </div>
                    <div className=' col-span-1 hidden md:block border-l border-l-dark-grey/30 p-4 '>
                        <div>
                            <div className=' border-l-4 border-l-dark-grey pl-3 text-xl' > Change slug </div>
                            <hr className='w-full opacity-10 my-5' />
                            <div className=' flex gap-4'>
                                <input type="text"
                                    ref={slug_ref}
                                    className=' input-box p-2 text-sm'
                                    defaultValue={blog_id}
                                />
                                {
                                    url_id ?
                                        <button className=' bg-black text-sm text-white px-4 py-2 rounded-md'
                                            onClick={HandelSlugUpdate}
                                        >
                                            Update
                                        </button>
                                        :
                                        ""
                                }
                                {
                                    !slug ? <button className=' bg-black text-sm text-white px-4 py-2 rounded-md'
                                        onClick={HandelSlugSet}
                                    >
                                        Set
                                    </button> : ""
                                }
                            </div>
                        </div>

                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}
