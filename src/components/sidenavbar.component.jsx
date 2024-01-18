import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../App'

export default function SideNav() {

    let page = location.pathname.split("/")[2];
    let { userAuth: { data: { access_token, admin }, new_notification_available } } = useContext(UserContext);
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();
    let activeTabLine = useRef();

    const [pageState, setPageState] = useState(page);      // .replace('-', ' ')
    const [showSideNav, setShowSideNav] = useState(false);


    function changePageState(e) {
        let { offsetWidth, offsetLeft } = e.target;

        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if (e.target == sideBarIconTab.current) {
            setShowSideNav(true);
        } else {
            setShowSideNav(false);
        }
    }

    useEffect(() => {
        setShowSideNav(false)
        if (pageStateTab.current) {
            pageStateTab.current.click();
        }
    }, [pageState])

    return (
        access_token === null ? <Navigate to={"/signin"} />
            :
            <>
                <section className=' relative flex gap-10 py-0 m-0 max-md:flex-col '>
                    <div className=' sticky top-0 z-30'>
                        <div className=' md:hidden bg-white py-1 border-b border-grey flex flex-nowrap '>

                            <button
                                ref={sideBarIconTab}
                                className=' p-5 capitalize '
                                onClick={changePageState}
                            >
                                <i className='fi fi-rr-bars-staggered pointer-events-none'></i>
                            </button>

                            <button
                                ref={pageStateTab}
                                onClick={changePageState}
                                className=' p-5 capitalize '
                            >
                                {pageState}
                            </button>

                            <hr
                                ref={activeTabLine}
                                className='absolute bottom-0 duration-500' />
                        </div>

                        {/* // Parennt div */}

                        {/* deleted tailwind classes is -: max-md:w-[calc(100%+80px)] */}
                        <div className={' min-w-[200px] h-[calc(100vh-80px-60px)] m:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white  max-md:px-16 max-md:-ml-7 duration-500 ' + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none " : "opacity-100 pointer-events-auto")}>

                            <h1 className=' text-xl text-dark-grey mb-3'>Dashboard</h1>

                            <hr className=' border-grey -ml-6 mb-8 mr-6' />

                            <NavLink
                                className="sidebar-link"
                                to={"/dashboard/blogs"} onClick={(e) => setPageState(e.target.innerText)} >
                                <i className='fi fi-rr-document'></i>Blogs
                            </NavLink>

                            {
                                admin ?
                                    <NavLink
                                        className="sidebar-link"
                                        to={"/dashboard/medias"} onClick={(e) => setPageState(e.target.innerText)} >
                                        <i className='fi fi-rr-picture'></i>Medias
                                    </NavLink>
                                    : ""

                            }

                            <NavLink
                                className="sidebar-link"
                                to={"/dashboard/notifications"} onClick={(e) => setPageState(e.target.innerText)} >
                                <div className=' relative'>
                                    <i className='fi fi-rr-bell'></i>
                                    {
                                        new_notification_available ?
                                            <span className=' bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0 shadow-lg'></span>
                                            :
                                            ""
                                    }
                                </div>
                                Notification
                            </NavLink>

                            <NavLink
                                className={"sidebar-link"}
                                to="/editor" onClick={(e) => setPageState(e.target.innerText)} >
                                <i className='fi fi-rr-file-edit'></i>Write
                            </NavLink>


                            <h1 className=' text-xl text-dark-grey mt-20 mb-3'>Settings</h1>

                            <hr className=' border-grey -ml-6 mb-8 mr-6' />

                            <NavLink
                                className={"sidebar-link"}
                                to="/settings/edit-profile"
                                onClick={(e) => setPageState(e.target.innerText)} >
                                <i className='fi fi-rr-user'></i>
                                Edit Profile
                            </NavLink>

                            <NavLink
                                className={"sidebar-link"}
                                to="/settings/change-password"
                                onClick={(e) => setPageState(e.target.innerText)} >
                                <i className='fi fi-rr-lock'></i>
                                Change Password
                            </NavLink>

                        </div>
                    </div>
                    {/* // TODO: ----------------Outlent Components Render ------------------------- */}
                    <div className=' max-md:mt-8 mt-5 w-full'>
                        <Outlet />
                    </div>

                </section>
            </>
    )
}
