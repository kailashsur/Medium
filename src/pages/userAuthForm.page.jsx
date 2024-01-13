import React, { useContext, useRef } from 'react'
import InputBox from '../components/input.component'
import googleIcon from '../imgs/google.png'
import { Link, Navigate } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import { Toaster, toast } from "react-hot-toast"
import axios from "axios"
import { storeInSession } from '../common/session'
import { UserContext } from '../App'
import { authWithGoogle } from '../common/firebase'

export default function UserAuthForm({ type }) {

    let auth = useContext(UserContext)
    // console.log("Auth state is ", auth);
    //destructor the access_token
    // let {setUserAuth, userAuth : {data : {access_token}}} =auth ? useContext(UserContext) : null;
    let access_token = auth.userAuth.data ? auth.userAuth.data.access_token : null;
    // console.log(access_token);

    const userAuthThroughServer = async (serverRoute, formData) => {
        try {
            let data = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
                // console.log(data);
            if (data) {
                storeInSession("user", JSON.stringify(data))
                // console.log("Responce is \n", data);

                auth.setUserAuth(data)
            }
        } catch (error) {
            console.log("Error is \n", error);
            toast.error(error.response.data.error);
            // if(response.data.error == "Failed to authenticate you with google. Try with some other google account"){
            //     toast.error(error.("You are not existing user. Please Signup"));

            // }
        }
    }

    const handelSubmit = (e) => {

        e.preventDefault();

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


        let sRoute = type == "sign-in" ? "/signin" : "/signup";

        // form data
        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }
        // form validation
        let { fullname, email, password } = formData;


        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("fullname must at least 3 letter long")
            }
        }
        if (!email.length) {
            return toast.error("Enter Email")
        }
        if (!emailRegex.test(email)) {
            return toast.error("Email is invalid")
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters")
        }

        userAuthThroughServer(sRoute, formData)
    }


    // google auth

    const handelGoogleAuth = (e)=>{
        e.preventDefault();

        authWithGoogle().then(user =>{
            // console.log(user);

            let serverRoute = "/google-auth";

            let formData = {
                access_token : user.accessToken
            }

            userAuthThroughServer(serverRoute, formData)

        }).catch((err)=>{

            toast.error('truble login through google');
            return console.log(err);
        })
    }

    return (
        access_token || access_token !=null ?
            <Navigate to="/" />
            :
            <AnimationWrapper keyValue={type}>
                <section className='h-cover flex items-center justify-center '>
                    <Toaster />

                    <form id='formElement' className='w-[80%] max-w-[400px]'>
                        <h1 className='text-4xl font-gelasio capitalize text-center mb-24 '>
                            {type == "sign-in" ? "Welcome Back" : "Join us Today"}
                        </h1>

                        {
                            type != "sign-in" ?
                                <InputBox
                                    name="fullname"
                                    type="text"
                                    placeholder="Full Name"
                                    icon="fi-rr-user"
                                /> : ""
                        }

                        <InputBox
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon="fi-rr-envelope"
                        />

                        <InputBox
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-key"
                        />

                        <button className='btn-dark center mt-14'
                            type='submit'
                            onClick={handelSubmit}
                        >
                            {
                                type.replace("-", " ")
                            }
                        </button>

                        <div className=' relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                            <hr className='w-1/2 border-black' />
                            <p>or</p>
                            <hr className='w-1/2 border-black' />
                        </div>

                        <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'
                        onClick={handelGoogleAuth}
                        >
                            <img src={googleIcon} className=' w-5' />
                            continue with google
                        </button>

                        {
                            type == "sign-in" ?
                                <p className='mt-6 text-dark-grey text-xl text-center'>
                                    Don't have an account?
                                    <Link to='/signup' className=' underline text-black text-xl ml-1'>
                                        Join here
                                    </Link>
                                </p>
                                :
                                <p className='mt-6 text-dark-grey text-xl text-center'>
                                    Alredy a member?
                                    <Link to='/signin' className=' underline text-black text-xl ml-1'>
                                        Sign in here.
                                    </Link>
                                </p>
                        }
                    </form>

                </section>
            </AnimationWrapper>
    )
}
