import React from 'react'

export default function Tiles({ grid, animateTile, colorTile }) {
    const tiles = grid.map((tile, index) => {
        return (
            <div 
            key={index} 
            className={
                `grid--item  
                ${animateTile === index && 'animate'} 
                ${colorTile.length !== 0 && colorTile[index]?.gridIndex === index && colorTile[index]?.highlight && `highlight--${colorTile[index]?.color}`}
                `}>
                {tile}
            </div>
        )
    })

    return (
        <div className="grid--container">{tiles}</div>
    )
}
