import React, { useState, useEffect } from 'react'
import Key from './Key'
import keyboard from '../helpers/keys'


export default function App() {

  const [grid, setGrid] = useState(Array(30).fill(""))
  const [keysArray, setKeysArray] = useState(keyboard)
  const [gridIndex, setGridIndex] = useState(0) //0~29
  const [gridRowIndex, setGridRowIndex] = useState(0) //0~5
  const [tooShort, setTooShort] = useState(false)
  const [continueToNextRow, setContinueToNextRow] = useState(true)

  const handleInput = (event) => {
    let pressedKey = event.type === "keydown" ? event.key.toUpperCase() : event.target.dataset.value.toUpperCase()
    pressedKey = (pressedKey === "BACKSPACE" || pressedKey === "DELETE") ? "DELETE" : pressedKey
    console.log(pressedKey)
    if (!keysArray.flat().includes(pressedKey)) return
      
    //if a row is filled, the user won't be able to move onto the next row until they hit enter
    if (gridIndex !== 0 && gridRowIndex > 4 && pressedKey !== "ENTER") {
      setContinueToNextRow(false)
      return
    }

    //only when they hit "ENTER" when at the end of the row can they move forward
    if (gridIndex !== 0 && gridIndex % 5 === 0 && pressedKey === "ENTER") {
      setGridRowIndex(0)
      setContinueToNextRow(true)
      setTooShort(false)
    }

    //the row is not yet filled but the user presses ENTER => no input
    if (pressedKey === "ENTER" && gridIndex % 5 !== 0) {
      setTooShort(true)
      return
    }
    
    if (continueToNextRow &&
        pressedKey !== "ENTER" &&
        pressedKey !== "DELETE"
      ) {
      setGrid(prev => {
        return prev.map((key, index) => {
          return index === gridIndex ? pressedKey : key
        })
      })
      setGridIndex(prev => prev + 1)
      setGridRowIndex(prev => prev + 1)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleInput)
    const timeoutId = setTimeout(() => {
      setTooShort(false)
    }, 1500);

    return () => {
      window.removeEventListener('keydown', handleInput)
      clearTimeout(timeoutId); // Clear the timeout on component unmount or re-render

    };
  }, [gridRowIndex, tooShort])

  const tiles = grid.map((tile, index) => {
    return (
      <div key={index} className="grid--item">
        {tile}
      </div>
    )
  })

  return (
    <div className="App">
      <div className="navbar">Wordle Clone</div>
      <div className="grid--container">{tiles}</div>
      <Key keysArray={keysArray} handleInput={handleInput}/>
      {tooShort && <div className="toggleShortMessage">Too short</div>}
    </div>
  )
}