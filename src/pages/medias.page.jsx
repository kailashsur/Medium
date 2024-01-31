import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import Loader from '../components/loader.component'
import appwriteServices from '../common/appwrite'
import toast, { Toaster } from 'react-hot-toast'
import MediaDetails from '../components/mediaDetails.component'

export default function Medias() {
    let { userAuth: { data: { admin, access_token } } } = useContext(UserContext)

    const [images, setImages] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null)
    const [showImageView, setShowImageView] = useState(false)

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
        setSelectedImage({ id, name, url, setShowImageView, images, setImages })
    }

    return admin == true ? (
        <div className='w-full h-full grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-wrap gap-4 justify-center items-start'>

           

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
                    <Loader />
            }
            {

            }
        </div>
    ) : (
        <Navigate to={"/"} />
    );
}
