import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNav from "./components/sidenavbar.component";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";
import Medias from "./pages/medias.page";
import Notifications from "./pages/notifications.page";

export const UserContext = createContext({})    // here the userContext exported

const App = () => {

    const [userAuth, setUserAuth] = useState({ data: { access_token: null } }); //it was initial stage {}


    useEffect(() => {

        let userInSession = lookInSession("user");
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ data: { access_token: null } })

    }, [])

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
                <Route path="/editor" element={<Editor />} />
                <Route path="/editor/:blog_id" element={<Editor />} />

                <Route path="/" element={<Navbar />} >
                    <Route index element={<HomePage />} />
                    <Route path="/dashboard" element={<SideNav/>}>
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="medias" element={<Medias/>}/>
                    </Route>
                    <Route path="/settings" element={<SideNav/>}>
                        <Route path="edit-profile" element={<EditProfile/>}/>
                        <Route path="change-password" element={<ChangePassword/>} />
                    </Route>

                    <Route path="/signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="/signup" element={<UserAuthForm type="sign-up" />} />
                    <Route path="search/:query" element={<SearchPage />} />

                    <Route path="user/:id" element={<ProfilePage />} />

                    <Route path="blog/:blog_id" element={<BlogPage />} />

                    <Route path="*" element={<PageNotFound />} />
                </Route>

            </Routes>
        </UserContext.Provider>
    )
}

export default App;