import React, { useContext, useState } from 'react'
import "./reserve.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import useFetch from '../../hooks/useFetch'
import { SearchContext } from '../../context/searchContext'
import  axios  from 'axios'
import {useNavigate} from 'react-router-dom'

export default function Reserve({ setOpen, hotelId }) {

    const [selectedRooms, setSelectedRooms] = useState([]);

    const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`)
    const { date } = useContext(SearchContext)

    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate)
        const end = new Date(endDate)

        const newDate = new Date(start.getTime());
        let dates = [];
        // console.log(newDate)
        while (newDate <= end) {
            // console.log("hello")
            dates.push(new Date(newDate).getTime())
            newDate.setDate(newDate.getDate() + 1)
        }

        return dates;
    }

    const alldates = getDatesInRange(date[0]?.startDate, date[0]?.endDate)

    const isAvailable = (roomNumbers) => {
        const isFound = roomNumbers.unavailableDates.some((date) => 
            alldates.includes(new Date(date).getTime())
        )
        console.log(isFound)

        return !isFound;
    }

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedRooms(
            checked
                ? [...selectedRooms, value]
                : selectedRooms.filter((item) => item !== value))
    }

    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            await Promise.all(selectedRooms.map(roomId => {
                const res = axios.post(`/rooms/availability/${roomId}`, { date: alldates })
                return res.data
            }));
            setOpen(false);
            navigate("/")


        } catch (error) {
                console.log(error)
        }
    }
    return (
        <div className="reserve">
            <div className="Container">
                <FontAwesomeIcon icon={faCircleXmark} className='rClose' onClick={() => { setOpen(false) }} />
                <span>Select your rooms:</span>
                {data && data?.message && data?.message?.map((item, index) =>
                    <div className="rItem" key={index}>
                        <div className="rItemInfo">
                            <div className="rTitle">{item?.title}</div>
                            <div className="rDesc">{item?.desc}</div>
                            <div className="rMax">
                                Max People: <b>{item?.maxPeople}</b>
                            </div>
                            <div className="rPrice">{item?.price}</div>
                        </div>
                        <div className='rSelectionRooms'>
                            {item.roomNumbers.map((roomNumbers, i) => (
                                <div className="room" key={i}>
                                    <label>{roomNumbers?.number}</label>
                                    <input
                                        type='checkbox'
                                        value={roomNumbers?._id}
                                        onChange={handleSelect}
                                        disabled={!isAvailable(roomNumbers)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button className='rButton' onClick={handleClick}>Reserve Now</button>
            </div>
        </div>
    )
}
