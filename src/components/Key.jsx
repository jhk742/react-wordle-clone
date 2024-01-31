import React from 'react'

export default function Key({ keysArray, handleInput }) {

    const keys = keysArray.map((keyRow, index) => {
        return (
            <div key={index} className="keyRow">
            {keyRow.map((keyItem, innerIndex) => {
                return (
                <div 
                    key={innerIndex} 
                    data-value={keyItem}
                    onClick={handleInput}
                    className={`keyItem keyItem--${keyItem}`}>
                    {keyItem}
                </div>
                )
            })}
            </div>
        )
    })

    return (
        <div className="keys--container">{keys}</div>
    )
}