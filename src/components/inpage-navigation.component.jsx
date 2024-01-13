import React, { useEffect, useRef, useState } from 'react'

export let activeTabRef;
export let activeTabLineBarRef;


export default function InPageNavigation({ routes, defaultHidden = [] , defaultActiveIndex = 0, children }) {

    let [ inPageNavIndex , setInPageNavIndex ] = useState(defaultActiveIndex);
    activeTabLineBarRef = useRef();
    activeTabRef = useRef();

    const changePageState = (btn, i)=>{

        let { offsetWidth, offsetLeft } = btn;

        activeTabLineBarRef.current.style.width = offsetWidth + "px";
        activeTabLineBarRef.current.style.left = offsetLeft + "px";

        setInPageNavIndex(i)
    }

    useEffect(()=>{
        changePageState(activeTabRef.current, defaultActiveIndex)

    },[])

  return (
    <>
    <div className=' relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>


    {
        routes.map((routes, i)=>{
            return(
                <button 
                ref={i == defaultActiveIndex ? activeTabRef : null  }
                key={i} className={"p-4 px-5 capitalize "+ (inPageNavIndex == i ? "text-black" : "text-dark-grey ") + (defaultHidden.includes(routes) ? " md:hidden ": "")}
                onClick={(e)=>{changePageState(e.target, i)}}
                >
                    {routes}
                </button>
            )
        })
    }
    <hr ref={activeTabLineBarRef} className=' absolute bottom-0 duration-300' />
    </div>

    { Array.isArray(children) ? children[inPageNavIndex] : children }

    </>
  )
}
