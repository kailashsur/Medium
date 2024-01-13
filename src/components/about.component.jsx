import React from 'react'
import { Link } from 'react-router-dom';
import { getFullDay } from '../common/date';

export default function AboutUser({ bio, social_links, joinedAt, className }) {
  return (
    <div className={" md:w-[90%] md:mt-7 " + className}>
        <p className=' text-xl leading-7'>
          { bio.length ? bio : "Nothing to read here"}
        </p>


        <div className=' flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey'>

          {// this function will give an array of the object keys

            Object.keys(social_links).map((key, i)=>{
              let link = social_links[key];

              return link ? <Link to={link} key={i} className=' capitalize'
              target='_blank'
              > 
              <i className={"fi "+ (key != 'website' ? "fi-brands-"+key : "fi-rr-globe") + " text-xl hover:text-black"}
              >
              </i> {key} 
              </Link> : " "

            })
          }

        </div>

        <p className=' text-xl leading-7 text-dark-grey '> Joined on {getFullDay(joinedAt)}
        </p>
    </div>
  )
}
