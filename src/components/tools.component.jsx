// importing tools

import  Embed from "@editorjs/embed";
import  List from "@editorjs/list";
import  ImageTool from "@editorjs/image";
import  Header from "@editorjs/header";
import  Quote from "@editorjs/quote";
import  Marker from "@editorjs/marker";
import  InlineCode from "@editorjs/inline-code";

import { uploadImage } from "../common/aws";

const uploadImageByUrl = async (e)=>{
    let link = new Promise((resolve, reject)=>{
        try {
            resolve(e)
        } catch (err) {
            reject(err)
        }
    })

    return link.then((url)=>{
        return {
            success : 1,
            file : { url }
        }
    })
}

const uploadImageByFile = async (e)=>{
    return uploadImage(e).then(url =>{
        if(url){
            return {
                success : 1,
                file : { url }
            }
        }
    })
}

export const Tools = {
    embed : Embed,
    list : {
        class : List,
        inlineToolbar : true
    },
    imagetool : {
        class : ImageTool,
        config : {
            uploader : {
                uploadByUrl : uploadImageByUrl,
                uploadByFile : uploadImageByFile ,
            }
        }
    },
    header : {
        class : Header,
        config: {
            placeholder : "Type Heading...",
            levels : [1,2,3,4,5,6],
            defaultLevel: 2,
        }
    },
    quote : {
        class : Quote,
        inlineToolbar : true
    },
    marker : Marker,
    inlinecode : InlineCode,
}