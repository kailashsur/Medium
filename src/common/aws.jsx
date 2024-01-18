import axios from 'axios';
import React from 'react'
import appwriteServices from './appwrite';

export const uploadImage = async (img) => {
    let url = null;
    let res = await appwriteServices.uploadFile(img);
    if(res){
        let {href} = appwriteServices.getFilePreview(res.$id)

        // axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/img-url", { img : href})


        return href
    }
}
