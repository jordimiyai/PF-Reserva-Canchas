import React, { useState } from "react";
import { useEffect } from "react";

const Hours = ({currentDate, disabledTime}) => {
    const [hours, setHours] = useState([])
    var tempHours=[]

    useEffect(()=> {
        setHours([])
        for (let i = 0; i < 24; i++) { 
            disabledTime?.times.find(t => t===i)?
            setHours(prevHours => [
                ...prevHours,
                {
                    hour: i,
                    disabled: true
                }
            ])
            :
            setHours(prevHours => [
                ...prevHours,
                {
                    hour: i,
                    disabled: false
                }
            ])
        }
    },[disabledTime])

    return (
        <div className="rounded drop-shadow-md">
            <div className="flex flex-col justify-center items-center text-white bg-[#009a17] h-[78px]">
                <h1 className="inline-block align-middle">HORARIOS</h1>
                <span>{currentDate.day}/{currentDate.month}/{currentDate.year}</span>
            </div>
            <div className="grid grid-rows-6 gap-4 grid-flow-col bg-white p-4 h-[283px] content-center">
                {hours?.map((h)=> (
                    <span key={h.hour} className={`flex items-center justify-center align-baseline text-gray-700 ${h.disabled?"pointer-events-none text-gray-700 text-opacity-25":"hover:bg-[#03bf1f] hover:text-white"} text-center w-16 items-center rounded-2xl cursor-pointer`}>
                        {h.hour}:00
                    </span>
                ))}
            </div>
        </div>
    )
}

export default Hours;