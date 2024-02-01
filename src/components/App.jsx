import React, { useState, useEffect } from 'react'
import Key from './Key'
import Tiles from './Tiles'
import keyboard from '../helpers/keys'
import keyboardHighlights from '../helpers/keysHighlight'
import fiveLetterWords from '../helpers/wordBank'

// const answer = "RIGHT"

export default function App() {

  const [grid, setGrid] = useState(Array(30).fill(""))
  const [keysArray, setKeysArray] = useState(keyboard)
  const [gridRow, setGridRow] = useState({start: 0, finish: 4})
  const [gridIndex, setGridIndex] = useState(0) //0~29
  const [rowIndex, setRowIndex] = useState(0) //0~5
  const [tooShort, setTooShort] = useState(false)
  const [continueToNextRow, setContinueToNextRow] = useState(true)
  const [animateTile, setAnimateTile] = useState(null)
  const [colorTile, setColorTile] = useState([])
  const [colorKey, setColorKey] = useState(keyboardHighlights)

  const [userAnswer, setUserAnswer] = useState("")
  const [wordBank, setWordBank] = useState(fiveLetterWords)
  const [answer, setAnswer] = useState(wordBank[Math.floor(Math.random() * wordBank.length)])
  // const [gameState, setGameState] = useState(true)
  const [gameState, setGameState] = useState({play: true, status: "none"})

  console.log(answer)

  const compareAnswer = () => {
    for (let i = gridRow.start; i <= gridRow.finish; i++) {
      if (grid[i] === answer[i - gridRow.start]) {
        //highlight tile green
        setColorTile(prev => [...prev, {highlight: true, color: "green", gridIndex: i}])
        setColorKey(prev => {
          return ({...prev, [grid[i]]: {highlight: true, color: "green"}})
        })
        console.log(i, "YESG", "VALUE: " + grid[i])
      } else if (grid[i] !== answer[i - gridRow.start] && answer.includes(grid[i])) {
        //highlight tile yellow
        setColorTile(prev => [...prev, {highlight: true, color: "yellow", gridIndex: i}])
        setColorKey(prev => {
          return ({...prev, [grid[i]]: {highlight: true, color: "yellow"}})
        })
        console.log(i, "YESY", "VALUE: " + grid[i])
      } else {
        //highlight tile gray
        setColorTile(prev => [...prev, {highlight: true, color: "gray", gridIndex: i}])
        setColorKey(prev => {
          return ({...prev, [grid[i]]: {highlight: true, color: "gray"}})
        })
      }
      setUserAnswer(prev => prev + grid[i])
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
    setRowIndex(prev => prev + 1)
  }

  const removeCharacter = () => {

    // this means the row above has been submitted and locked to prevent deletion
    if (gridIndex <= gridRow.start) return

    setGrid(prev => {
      let lastNonEmptyIndex = grid.findIndex(char => char === "") - 1
      return prev.map((prevCharacter, index) => {
        return index === lastNonEmptyIndex ? "" : prevCharacter
      })
    })
    setGridIndex(prev => prev - 1)
    setRowIndex(prev => prev - 1)
    setContinueToNextRow(true)
  }

  const handleInput = (event) => {
    let pressedKey = event.type === "keydown" ? event.key.toUpperCase() : event.target.dataset.value.toUpperCase()
    pressedKey = (pressedKey === "BACKSPACE" || pressedKey === "DELETE") ? "DELETE" : pressedKey
    if (!keysArray.flat().includes(pressedKey)) {
      return}

    //to delete
    if (gridIndex !== 0 && pressedKey === "DELETE") {
      removeCharacter()}

    //if a row is filled, the user won't be able to move onto the next row until they hit enter
    if (gridIndex !== 0 && rowIndex > 4 && pressedKey !== "ENTER") {
      setContinueToNextRow(false)
      return
    }

    //only when they hit "ENTER" when at the end of the row can they move forward
    if (gridIndex !== gridRow.start && gridIndex % 5 === 0 && pressedKey === "ENTER") {
      setRowIndex(0)
      setContinueToNextRow(true)
      setTooShort(false)
      setUserAnswer("")
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
    if (userAnswer === answer) {
      setGameState({play: false, status: "win"});
      console.log(gameState)
    }

    window.addEventListener("keydown", handleInput)
    const timeoutId = setTimeout(() => {
      setTooShort(false)
    }, 700)

    // Clear the animation state after a delay
    const animationTimeoutId = setTimeout(() => {
      setAnimateTile(false)
    }, 150);

    return () => {
      window.removeEventListener('keydown', handleInput)
      clearTimeout(timeoutId) // Clear the timeout on component unmount or re-render
      clearTimeout(animationTimeoutId) // Clear the animation timeout on component unmount or re-render
    }

  }, [rowIndex, tooShort, gridRow, userAnswer, answer])

  useEffect(() => {
    
  }, [userAnswer, answer]);

  return (
    <div className="App">
      <div className="navbar">Wordle Clone</div>
      <Tiles grid={grid} colorTile={colorTile} animateTile={animateTile} />
      <Key keysArray={keysArray} colorKey={colorKey} handleInput={handleInput}/>
      {tooShort && <div className="toggleShortMessage">Too short</div>}
      {!gameState.play && 
      <div className="toggleShortMessage">
        {`You ${gameState.status}`}
        <button>Play Again?</button>
      </div>}
    </div>
  )
}