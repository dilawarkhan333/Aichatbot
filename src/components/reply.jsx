import React, { useState } from 'react'
import { useEffect } from 'react';
import { checkingHeading, replaceHeadingStart } from '../request';

const Replay = ({ rep, totalResult,index, type }) => {
 
const [heading, setHeading] = useState(false);
const [replying, setReplying] = useState(rep);

  useEffect(() => {
    if (checkingHeading(rep)) {
      setHeading(true);
      setReplying(replaceHeadingStart(rep))
    }
  }, [])


  return (
    <div>

{
  index==0 && totalResult>1?<span className='pt-2 text-xl block text-white'>{replying}</span>:
  heading ? <span className='pt-2 text-lg block text-white'>{replying}</span>
  : <span className={type=='q'?'pl-1':'pl-5'}>{replying}</span>
  

}

      
    </div>
  )
}

export default Replay;