import React from 'react'

export default function Tiles({ grid, animateTile }) {
    const tiles = grid.map((tile, index) => {
        return (
            <div key={index} className={`grid--item ${animateTile === index && 'animate'}`}>{tile}</div>
        )
    })

    return (
        <div className="grid--container">{tiles}</div>
    )
}