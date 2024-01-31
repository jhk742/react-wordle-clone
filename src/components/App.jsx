import React, { useState, useEffect } from 'react'

export default function App() {

  const [grid, setGrid] = useState(Array(30).fill(""))
  const [keysArray, setKeysArray] = useState([
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"]
  ])

  const tiles = grid.map((tile, index) => {
    return (
      <div key={index} className="grid--item">
      </div>
    )
  })

  const keys = keysArray.map((keyRow, index) => {
    return (
      <div key={index} className="keyRow">
        {keyRow.map((keyItem, innerIndex) => {
          return (
            <div key={innerIndex} className={`keyItem keyItem--${keyItem}`}>
              {keyItem}
            </div>
          )
        })}
      </div>
    )
  })

  console.log(keys)

  return (
    <div className="App">
      <div className="navbar">
        Wordle Clone
      </div>
      <div className="grid--container">
        {tiles}
      </div>
      <div className="keys--container">
        {keys}
      </div>
    </div>
  )
}