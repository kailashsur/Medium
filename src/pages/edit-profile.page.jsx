import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios';
import { profileDataStructure } from './profile.page';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import toast, { Toaster } from 'react-hot-toast';
import InputBox from '../components/input.component';
import { uploadImage } from '../common/aws';
import { storeInSession } from '../common/session';

//----------------------------Starting Default Functon-------------------------------
export default function EditProfile() {

    // State Defining
    const [ profile, setProfile ] = useState(profileDataStructure);
    const [ loading, setLoding ] = useState(true);
    
    
    // Destructuring the data from the contexts and responces
    let {userAuth, setUserAuth, userAuth : {data, data : {access_token}}}= useContext(UserContext);
    let { personal_info: { fullname, username:profile_username, profile_img, email, bio}, social_links } = profile;
    
    let bioLimit = 150;
    const [ characterLeft, setcharacterLeft] = useState(bioLimit);
    const [ updatedProfileImg, setUpdatedProfileImg ] = useState(null);

    let profileImgEle = useRef();
    let editProfileForm = useRef();



    useEffect(()=>{
        if(access_token){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: data.username} )
            .then(({data})=>{
                // fetch the data and set to the edi prof9le components
                setProfile(data);
                setLoding(false);
            })
            .catch(err => console.log("Axios err from edit-profile useEffect line", err))
        }
    },[access_token])

    const handelCharacterChange = (e)=>{
        setcharacterLeft(bioLimit - e.target.value.length)
    }

    const handelImagePreview = (e)=>{
        let img = e.target.files[0];

        profileImgEle.current.src = URL.createObjectURL(img);

        setUpdatedProfileImg(img);
    }

    function handelImageUpload(e){

        e.preventDefault();

        if(updatedProfileImg){

            let loadingToast = toast.loading("Uploading...");

            e.target.setAttribute("disabled", true);
//AWS uploadImg function calling and updating and uploading the image into the aws bucket
            uploadImage(updatedProfileImg)
            .then(url =>{
                // set the url to the database to update the profile image url setting

                if(url){
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", { url }, {
                        headers:{
                            'Authorization' : `Bearer ${access_token}`
                        }
                    })
                    .then(({ data })=>{
                        // console.log(data);
                        let newUserAuth = {...userAuth, profile_img: data.profile_img}

                        storeInSession("user", JSON.stringify(newUserAuth));
                        setUserAuth(newUserAuth);

                        setUpdatedProfileImg(null);
                        toast.dismiss(loadingToast);
                        e.target.removeAttribute("disabled");
                        toast.success("Uploaded 👍");
                    })
                    .catch((responce) =>{
                        toast.dismiss(loadingToast);
                        e.target.removeAttribute("disabled");
                        toast.error("Something went wrong ❌");
                        console.log("responce from handelsubmit()",responce);


                    })
                }
            })
            .catch(err =>{
                console.log("uploading aws in :: handelImageUpload", err);
            })
        }
    }

    function handelSubmit(e){
        e.preventDefault();

        let form = new FormData(editProfileForm.current);

        let formData = {}

        for(let [key, value] of form.entries()){
            formData[key] = value;

        }

        let {
            username,
            bio,
            youtube,
            instagram,
            facebook,
            twitter,
            github,
            website
        } = formData;

        if(username.length < 3)
        {
            return toast.error("Username should greater than 3 letter");
        }
        if(bio.length > bioLimit){
            return toast.error(`Bio should not more than ${bioLimit}`)
        }

        let loadingToast = toast.loading("Updating...");
        e.target.setAttribute("disabled", true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
            username, bio,
            social_links : { youtube,instagram,facebook,twitter,github,website }
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(({data})=>{
            if(userAuth.username != data.username){

                let newUserAuth = { ...userAuth, username : data.username};
                storeInSession("user", JSON.stringify(newUserAuth));
                setUserAuth(newUserAuth);
            }

            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled")
            toast.success("Profile Updated ✔")
        })
        .catch(responce =>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled")
            toast.success("Profile Updated ✔")

            console.log("Procile not updated error :: handelSubmit ::  ", responce);

        })
    }

  return (
    <AnimationWrapper>
        {
            loading ? <Loader/>
            :
            <form ref={editProfileForm} >
                <Toaster/>

                <h1 className=' max-md:hidden'>
                    Edit Profile
                </h1>

                <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
                    <div className=' max-lg:center mb-5'>
                        <label htmlFor='uploadImg' id='profileImgLabel'
                        className=' relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                            <div className=' w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer' >
                                Upload Image
                            </div>
                            <img ref={profileImgEle} src={profile_img} />
                        </label>

                        <input type='file' id='uploadImg' accept='.jpeg , .png , .jpg' hidden
                        onChange={handelImagePreview}
                        />

                        <button className=' btn-light mt-5 max-lg:center lg:w-full px-10'
                        onClick={handelImageUpload}
                        >Upload</button>
                    </div>

                    <div className=' w-full'>
                        <div className=' grid grid-cols-1 md:grid-cols-2 md:gap-5 '>
                            <div>
                                <InputBox name="fullname" type="text" value={fullname} placeholder={"Fullname" } disable={true} icon={"fi-rr-user"} />
                            </div>
                            <div>
                                <InputBox name="email" type="email" value={email} placeholder={"Email" } disable={true} icon={"fi-rr-envelope"} />
                            </div>
                        </div>

                        <InputBox type={"text"} name={"username"} value={profile_username} placeholder={"Username"} icon={"fi-rr-at"} />

                        <p className='text-dark-grey -mt-3'>Username will use to search user and will be visible to all users</p>

                        <textarea name='bio' maxLength={bioLimit} defaultValue={bio} className=' input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5 placeholder:text-dark-grey ' placeholder='Bio' onChange={handelCharacterChange} >
                        </textarea>

                        <p className=' mt-1 text-dark-grey '>
                             {characterLeft} </p>
                        <p className=' my-6 text-dark-grey '>
                            Add your socials
                        </p>

                        <div className=' md:grid md:grid-cols-2 gap-x-6'> 
                            {
                                Object.keys(social_links).map((key, i)=>{
                                    let link = social_links[key];

                                 

                                    return <InputBox key={i} name={key} type={"text"} value={link} placeholder={"https://"} icon={"fi "+ (key != 'website' ? "fi-brands-"+key : "fi-rr-globe")}  />
                                })
                            }
                        </div>

                        <button 
                        onClick={handelSubmit}
                        className='btn-dark w-auto px-10'
                        type='submit'
                        >Update</button>
                    </div>
                </div>
            </form>
        }
    </AnimationWrapper>
  )
}


