import React, { useContext, useRef } from 'react'
import AnimationWrapper from '../common/page-animation'
import InputBox from '../components/input.component'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from '../App';

export default function ChangePassword() {

    let { userAuth: { data : { access_token }} } = useContext(UserContext);
    // create reference
    let changePasswordForm = useRef();

let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


    const handelSubmit = (e)=>{
        e.preventDefault();

        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for(let [key, value] of form.entries())
        {
            formData[key]= value;
        }

        let { currentPassword, newPassword } = formData;

        if(!currentPassword.length || !newPassword.length){
            return toast.error("Fill all the box")
        }

        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("Password should be 6 to 20 characters, a numeric, 1 lowercase & 1 Uppercase letters");
        }

        e.target.setAttribute("disabled", true);
        let loadingToast = toast.loading("Updating...");

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password",
        formData, {
            headers : {
                'Authorization' : `Bearer ${access_token}`
            }
        })
        .then(()=>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.success("Password Updated ✔");
        })
        .catch(({responce} )=>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            console.log("CAtch res : ", responce);
            // return toast.error(responce.data.error);

        })

    }

  return (
    <AnimationWrapper>
        <Toaster/>
        <form ref={changePasswordForm} >
            <h1 className=' max-md:hidden'
            >Change Password</h1>

            <div className='py-10 w-full md:max-w-[400px]'>
                <InputBox name="currentPassword" type="password" className="profile-edit-input " placeholder="Current Password" icon="fi-rr-unlock" />
                <InputBox name="newPassword" type="password" className="profile-edit-input " placeholder="New Password" icon="fi-rr-unlock" />

                <button 
                onClick={handelSubmit}
                className='btn-dark px-10 ' type='submit'
                >Change Password</button>
            </div>
        </form>
    </AnimationWrapper>
  )
}
