import React, { useState, useEffect } from 'react'
import Key from './Key'
import Tiles from './Tiles'
import keyboard from '../helpers/keys'

const answer = "RIGHT"
//https://wordlegame.org/

export default function App() {

  const [grid, setGrid] = useState(Array(30).fill(""))
  const [keysArray, setKeysArray] = useState(keyboard)
  const [gridIndex, setGridIndex] = useState(0) //0~29
  const [gridRowIndex, setGridRowIndex] = useState(0) //0~5
  const [gridRow, setGridRow] = useState({start: 0, finish: 4})
  const [tooShort, setTooShort] = useState(false)
  const [continueToNextRow, setContinueToNextRow] = useState(true)
  const [animateTile, setAnimateTile] = useState(null)
  // const [colorTile, setColorTile] = useState({highlight: false, color: "none", gridIndex})
const [colorTile, setColorTile] = useState([])

  const compareAnswer = () => {
    for (let i = gridRow.start; i <= gridRow.finish; i++) {
      if (grid[i] === answer[i - gridRow.start]) {
        //highlight tile green
        // setColorTile({highlight: true, color: "green", gridIndex: i})
        setColorTile(prev => [...prev, {highlight: true, color: "green", gridIndex: i}])
        console.log(i, "YESG")
      } else if (grid[i] !== answer[i - gridRow.start] && answer.includes(grid[i])) {
        //highlight tile yellow
        // setColorTile({highlight: true, color: "yellow", gridIndex: i})
        setColorTile(prev => [...prev, {highlight: true, color: "yellow", gridIndex: i}])
        console.log(i, "YESY")
      } else {
        setColorTile(prev => [...prev, {highlight: true, color: "gray", gridIndex: i}])
        console.log(i, "NO")
      }
    }
    console.log()
    setGridRow(prev => ({start: prev.finish + 1, finish: prev.finish + 5}))
  }

  const addCharacter = (pressedKey) => {
    setGrid(prev => {
      return prev.map((key, index) => {
        return index === gridIndex ? pressedKey : key
      })
    })
    setAnimateTile(gridIndex)
    setGridIndex(prev => prev + 1)
    setGridRowIndex(prev => prev + 1)
  }

  const removeCharacter = () => {
    setGrid(prev => {
      let lastNonEmptyIndex = grid.findIndex(char => char === "") - 1
      return prev.map((prevCharacter, index) => {
        return index === lastNonEmptyIndex ? "" : prevCharacter
      })
    })
    setGridIndex(prev => prev - 1)
    setGridRowIndex(prev => prev - 1)
  }

  const handleInput = (event) => {
    let pressedKey = event.type === "keydown" ? event.key.toUpperCase() : event.target.dataset.value.toUpperCase()
    pressedKey = (pressedKey === "BACKSPACE" || pressedKey === "DELETE") ? "DELETE" : pressedKey
    if (!keysArray.flat().includes(pressedKey)) return
      
    //to delete
    if (gridIndex !== 0 && pressedKey === "DELETE") removeCharacter()

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
      compareAnswer()
    }

    //the row is not yet filled but the user presses ENTER => no input
    if (pressedKey === "ENTER" && gridIndex % 5 !== 0) {
      setTooShort(true)
      return
    }

    //if input passess all conditions, have the character appear in the corresponding tile
    if (continueToNextRow &&
        pressedKey !== "ENTER" &&
        pressedKey !== "DELETE"
      ) {
      addCharacter(pressedKey)
    } 
  }

  useEffect(() => {
    console.log(colorTile);
  }, [colorTile]);

  useEffect(() => {
    window.addEventListener("keydown", handleInput)
    const timeoutId = setTimeout(() => {
      setTooShort(false)
    }, 1500)

    // Clear the animation state after a delay
    const animationTimeoutId = setTimeout(() => {
      setAnimateTile(false)
    }, 150);

    return () => {
      window.removeEventListener('keydown', handleInput)
      clearTimeout(timeoutId) // Clear the timeout on component unmount or re-render
      clearTimeout(animationTimeoutId) // Clear the animation timeout on component unmount or re-render
    }

  }, [gridRowIndex, tooShort])

  return (
    <div className="App">
      <div className="navbar">Wordle Clone</div>
      {/* <div className="grid--container">{tiles}</div> */}
      <Tiles grid={grid} animateTile={animateTile} colorTile={colorTile}/>
      <Key keysArray={keysArray} handleInput={handleInput}/>
      {tooShort && <div className="toggleShortMessage">Too short</div>}
    </div>
  )
}