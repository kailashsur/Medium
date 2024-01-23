import React from 'react'

const Img = ({ url, caption })=>{

    return (
        <div>
            <img src={url} alt={caption} className=' rounded-md' />
            { 
                caption.length ? <p className=' w-full text-center my-3 md:mb-12 text-sm text-dark-grey'> {caption} </p>
                : ""
            }
        </div>
    )

}

const Quote = ({quote, caption})=>{
    return(
        <div className=' bg-purple/10 p-3 pl-5 border-l-4 border-purple'>
            <p className=' text-xl leading-10 md:text-2xl'>{quote}</p>
            {
                caption.length ? <p className='w-full text-purple text-base'>{caption}</p>
                :""
            }
        </div>
    )
}
const List = ({style, items})=>{

    return (
        <ol className={`pl-5 ${ style == "ordered" ? " list-decimal" : " list-disc"}`}>
            {
                items.map((listItem, i)=>{
                    return <li key={i} className='my-4' dangerouslySetInnerHTML={{__html:listItem}}>


                    </li>
                })
            }
        </ol>
    )

}

export default function BlogContent({block}) {
  let { type, data } = block;

  if(type == "paragraph"){
    return <p dangerouslySetInnerHTML={{__html: data.text}} className=' font-sourceSerif' ></p>
  }
  if(type == "header"){
    if(data.level == 3){
        return <h3 className=' text-3xl font-bold' dangerouslySetInnerHTML={{__html:data.text}}></h3>
    }
    if(data.level == 4){
        return <h4 className=' text-2xl font-bold' dangerouslySetInnerHTML={{__html:data.text}}></h4>
    }
    if(data.level == 5){
        return <h5 className=' text-xl font-bold' dangerouslySetInnerHTML={{__html:data.text}}></h5>
    }
    if(data.level == 6){
        return <h6 className=' text-base font-bold' dangerouslySetInnerHTML={{__html:data.text}}></h6>
    }
    return <h2 className=' text-4xl font-bold' dangerouslySetInnerHTML={{__html:data.text}}></h2>
  }

  if(type == "imagetool"){
    return <Img url={data.file.url} caption={data.caption} /> 
  }

  if(type == "quote"){
    return <Quote quote={data.text} caption={data.caption} />
  }
  if(type == "list"){
    return <List style={data.style} items={data.items} />
  }
}
