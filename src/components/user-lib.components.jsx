import React, { useContext, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { uploadImage } from '../common/aws';
import Loader from './loader.component';
import MediaDetails from './mediaDetails.component';
import { UserContext } from '../App';
import axios from 'axios';

export default function UserLib({ setShowLib }) {
    let { userAuth: { data: { admin, access_token } } } = useContext(UserContext)
    const [images, setImages] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageView, setShowImageView] = useState(false)


    const handelClose = () => {
        setShowLib(false);
    }

    const handelFileUpload = (e) => {
        let img = e.target.files[0];

        if (img) {
            let loadingToast = toast.loading("Uploading...")

            uploadImage(img).then((url) => {
                if (url) {
                    // setImages({total : images.total+1, files : images.files.push})
                    // console.log(url);
                    toast.dismiss(loadingToast);
                    toast.success("Uploaded 👍")
                    // blogBannerRef.current.src = url;
                }
            })
                .catch(err => {
                    toast.dismiss(loadingToast);
                    return toast.error(err);
                })
        }
    }
    // console.log(images);

    useEffect(() => {
        if (admin) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/image-list", {}, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(({ data }) => {
                    setImages(data);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [admin, access_token]);

    const handelRemoveImage = async (id) => {
        let loading = toast.loading("Deleting...")
        let res = await appwriteServices.deleteImage(id)
        if (res) {
            toast.dismiss(loading)
            const newArray = images.files.filter(img => img.id !== id);
            setImages({ total: images.total - 1, files: newArray })

            return toast.success("Image Deleted")
        }
        else {
            toast.dismiss(loading)
        }
    }
    // console.log(images);
    const handelViewDetails = ({ id, name, url, images, setImages }) => {
        setShowImageView(true)
        setSelectedImage({ id, name, url, setShowImageView, images, setImages, editor:true, setShowLib })
    }

    return (
        <div className='z-50 fixed top-0 left-0 h-screen w-screen bg-black/20 backdrop-filter backdrop-blur-md flex flex-col items-center'>
            <Toaster />
            <div className=' rounded-sm bg-white p-4 md:p-6 w-full md:max-w-[680px] h-full overflow-auto'>

                <div className='flex justify-between'>
                    <div className=' text-xl font-gelasio'>Media Library</div>

                    <div onClick={handelClose} className=' cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                            className=" w-8 h-8 p-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>

                    </div>
                </div>
                <hr className='w-full opacity-10 my-5' />

                <div>
                    <div className='w-fit'>
                        <label htmlFor='uploadfile'>
                            <input type="file"
                                id="uploadfile"
                                accept='.png, .jpg, .jpeg'
                                hidden
                                onChange={handelFileUpload} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                        </label>
                    </div>
                </div>
                <hr className='w-full opacity-10 my-5' />

                {
                    admin ?
                        <div className='w-full h-full grid grid-cols-2 md:grid-cols-3 gap-2 justify-evenly py-4 mb-4'>



                            <Toaster />
                            {showImageView ? selectedImage && <MediaDetails {...selectedImage} /> : ""}
                            {
                                images != null ?
                                    images.total == 0 ?
                                        <div className=' px-10 text-dark-grey'>
                                            No Medias</div>
                                        :
                                        images.files.map(({ id, name, url }, i) => {
                                            return (
                                                <div key={i} className="bg-white p-4 border border-dark-grey/30 rounded-md w-48 h-48 overflow-hidden  cursor-pointer flex flex-col justify-centerr">
                                                    <div className='flex items-center justify-between'>
                                                        <div className='text-base line-clamp-1'>{name}</div>
                                                        <i className="fi fi-rr-trash text-xl cursor-pointer" onClick={() => handelRemoveImage(id)}></i>
                                                    </div>
                                                    <img src={url} alt={name} className="mt-2 h-full w-full max-h-full max-w-full " onClick={() => handelViewDetails({ id, name, url, images, setImages })} />
                                                </div>


                                            )
                                        })
                                    :
                                    <div>
                                        Loading...
                                    </div>
                            }
                        </div>
                        :
                        <div>You are not admin </div>
                }

            </div>
        </div>
    )
}
