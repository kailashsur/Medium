import React, { useContext, useRef } from 'react'
import appwriteServices from '../common/appwrite';
import toast, { Toaster } from 'react-hot-toast';
import { EditorContext } from '../pages/editor.pages';

export default function MediaDetails({ id, name, url, setShowImageView, images, setImages, editor=false,setShowLib }) {
    const textFieldRef = useRef(null);
    let { blog, setBlog} = useContext(EditorContext);


    const handleCopyToClipboard = () => {
        if (textFieldRef.current) {
            textFieldRef.current.select();
            document.execCommand('copy');
        }
    };

    const handelClose = () => {
        setShowImageView(false)
    }

    const handelRemoveImage = async (id) => {
        handelClose();
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

    const handelSelect =()=>{
        setBlog({ ...blog, banner: url })
        handelClose();
        setShowLib(false);

    }
    return (
        <div className=' fixed top-0 left-0  w-full h-full overflow-hidden z-50 flex flex-col items-center justify-center backdrop-filter backdrop-blur-lg'>
            <Toaster/>
            <div className='flex flex-col items-center bg-white py-10 px-10 max-w-md shadow-lg rounded-md'>

                <img src={url} alt={name}
                    className=' h-52 max-h-full w-auto rounded-md shadow-lg '
                />


                <div className=' flex flex-col justify-center mt-6 w-full'>

                    <div className=' flex justify-between'>
                        <div> {name} </div>
                        <i className="fi fi-rr-trash text-xl cursor-pointer hover:text-red"
                            onClick={() => handelRemoveImage(id)}
                        ></i>
                    </div>

                    <textarea ref={textFieldRef} value={url} className=' line-clamp-1 input-box resize-none overflow-x-visible w-full mt-4 px-4 py-4 ' readOnly
                        style={{ whiteSpace: 'nowrap' }}
                    />
                </div>
                <div className=' flex flex-row justify-center items-center gap-4'>

                <button onClick={handleCopyToClipboard} className='h-10 px-6 font-semibold rounded-md bg-black text-white mt-4 active:bg-black/90'>Copy to Clipboard</button>
                {
                    editor ? 
                    <button onClick={handelSelect} className='h-10 px-6 font-semibold rounded-md bg-black text-white mt-4 active:bg-black/90'>Select</button>
                    :""
                }
                </div>

            </div>

            <div onClick={handelClose} className=' cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                    className="w-12 h-12 mt-10 bg-dark-grey/30 rounded-full p-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

            </div>
        </div>
    )
}
