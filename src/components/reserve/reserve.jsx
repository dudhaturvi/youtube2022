import React, { useContext, useState } from 'react'
import "./reserve.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import useFetch from '../../hooks/useFetch'
import { SearchContext } from '../../context/searchContext'

export default function Reserve({ setOpen, hotelId }) {

    const [selectedRooms, setSelectedRooms] = useState([]);

    const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`)
    const { date } = useContext(SearchContext)

    const getDatesInRange = (endDate, startDate) => {
        const start = new Date(startDate)
        const end = new Date(endDate)

        const newDate = new Date(start?.getTime());
        let dates = []
        console.log(newDate)
        while (newDate <= end) {
            console.log("hello")
            dates.push(new Date(newDate))
            newDate.setDate(newDate.getDate() + 1)
        }

        return dates;
    }

    const alldates = getDatesInRange(date[0]?.endDate, date[0]?.startDate)

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some(dates => {
            alldates.includes(new Date(date.getTime()))
        })

        return !isFound
    }

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedRooms(
            checked
                ? [...selectedRooms, value]
                : selectedRooms.filter((item) => item !== value))
    }
    const handleClick = () => {

    }
    return (
        <div className="reserve">
            <div className="Container">
                <FontAwesomeIcon icon={faCircleXmark} className='rClose' onClick={() => { setOpen(false) }} />
                <span>Select your rooms:</span>
                {data && data?.message && data?.message?.map((item, index) =>
                    <div className="rItem" key={index}>
                        <div className="rItemInfo">
                            <div>
                                <div className="rTitle">{item?.title}</div>
                                <div className="rDesc">{item?.desc}</div>
                                <div className="rMax">
                                    Max People: <b>{item?.maxPeople}</b>
                                </div>
                                <div className="rPrice">{item?.price}</div>
                            </div>
                            <div className='rSelectionRooms'>
                                {item?.roomNumbers?.map((roomNumber, i) => (
                                    <div className="room" key={i}>
                                        <label>{roomNumber?.number}</label>
                                        <input
                                            type='checkbox'
                                            value={roomNumber?._id}
                                            onChange={handleSelect}
                                            disabled={!isAvailable(roomNumber)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <button className='rButton' onClick={handleClick}>Reserve Now</button>
            </div>
        </div>
    )
}
