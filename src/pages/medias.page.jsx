import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import Loader from '../components/loader.component'
import appwriteServices from '../common/appwrite'
import toast, { Toaster } from 'react-hot-toast'

export default function Medias() {
    let { userAuth: { data: { admin, access_token } } } = useContext(UserContext)

    const [images, setImages] = useState(null);

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

    return admin == true ? (
        <div className='w-full h-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center'>
            <Toaster />
            {
                images != null ?
                    images.total == 0 ?
                        <div className=' px-10 text-dark-grey'>
                            No Medias</div>
                        :
                        images.files.map(({ id, name, url }, i) => {
                            return (
                                <div key={i} className="bg-white p-4 shadow-md">
                                    <div className=' flex items-center justify-between'>
                                        <div>{name}</div>
                                        <i className="fi fi-rr-trash text-xl cursor-pointer"
                                            onClick={() => handelRemoveImage(id)}
                                        ></i>
                                    </div>
                                    <img src={url} alt={name} className="mt-2 w-full h-auto" />
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
