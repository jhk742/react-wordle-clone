import React from 'react'

export default function Key({ keysArray, handleInput, colorKey }) {

    const keys = keysArray.map((keyRow, index) => {
        return (
            <div key={index} className="keyRow">
            {keyRow.map((keyItem, innerIndex) => {
                return (
                <div 
                    key={innerIndex} 
                    data-value={keyItem}
                    onClick={handleInput}
                    className={`
                    keyItem 
                    keyItem--${keyItem}
                    ${Object.keys(colorKey).length !== 0 && colorKey[keyItem]?.highlight && `highlight--${colorKey[keyItem]?.color}`}
                    `}>
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
}//${colorKey.length !== 0 && colorKey[index].highlight }