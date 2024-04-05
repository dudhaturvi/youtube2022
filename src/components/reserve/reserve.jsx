import React from 'react'
import "./reserve.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import useFetch from '../../hooks/useFetch'

export default function Reserve({setOpen,hotelId}) {

    const {data,loading,error} = useFetch(`/hotels/room/${hotelId}`)
    console.log('============|>')
    console.log(data);
  return (
    <div className="reserve">
        <div className="Container">
            <FontAwesomeIcon icon={faCircleXmark} className='rClose' onClick={()=>{setOpen(false)}}/>
            <span>Select your rooms:</span>
            {data && data?.message && data?.message?.map((item, index)=>
            
                <div className="rItem" key={index}>
                    <div className="rItemInfo">
                      
                        <div className="rTitle">{item?.title}</div>
                        <div className="rDesc">{item?.desc}</div>
                        <div className="rMax">
                            Max People: <b>{item?.maxPeople}</b>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}
