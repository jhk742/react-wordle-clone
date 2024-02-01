import React, { useState, useEffect, useRef } from 'react'
import Key from './Key'
import Tiles from './Tiles'
import keyboard from '../helpers/keys'
import keyboardHighlights from '../helpers/keysHighlight'
import fiveLetterWords from '../helpers/wordBank'

export default function App() {

  const [grid, setGrid] = useState(Array(30).fill(""))
  const [keysArray, setKeysArray] = useState(keyboard)
  const [gridRow, setGridRow] = useState({start: 0, finish: 4})
  const [gridIndex, setGridIndex] = useState(0) //0~29
  const [rowIndex, setRowIndex] = useState(0) //0~5
  const [tooShort, setTooShort] = useState(false)
  const [animateTile, setAnimateTile] = useState(null)
  const [colorTile, setColorTile] = useState([])
  const [colorKey, setColorKey] = useState(keyboardHighlights)
  const [userAnswer, setUserAnswer] = useState("")
  const [wordBank, setWordBank] = useState(fiveLetterWords)
  const [answer, setAnswer] = useState(wordBank[Math.floor(Math.random() * wordBank.length)])
  const [gameState, setGameState] = useState({play: true, status: "none"})
  const pressedKeyRef = useRef(null)

  const resetGame = () => {
    setGrid(Array(30).fill(""))
    setGridRow({start: 0, finish: 4})
    setGridIndex(0)
    setRowIndex(0)
    setTooShort(false)
    setAnimateTile(null)
    setColorTile([])
    setUserAnswer("")
    setAnswer(wordBank[Math.floor(Math.random() * wordBank.length)])
    setGameState({play: true, status: "none"})
    pressedKeyRef.current = null
  }

  const compareAnswer = () => {
    for (let i = gridRow.start; i <= gridRow.finish; i++) {
      if (grid[i] === answer[i - gridRow.start]) {
        //highlight tile green
        setColorTile(prev => [...prev, {highlight: true, color: "green", gridIndex: i}])
        setColorKey(prev => {
          return ({...prev, [grid[i]]: {highlight: true, color: "green"}})
        })
      } else if (grid[i] !== answer[i - gridRow.start] && answer.includes(grid[i])) {
        //highlight tile yellow
        setColorTile(prev => [...prev, {highlight: true, color: "yellow", gridIndex: i}])
        setColorKey(prev => {
          return ({...prev, [grid[i]]: {highlight: true, color: "yellow"}})
        })
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
  }

  const handleInput = (event) => {
    let pressedKey = event.type === "keydown" ? event.key.toUpperCase() : event.target.dataset.value.toUpperCase()
    pressedKey = (pressedKey === "BACKSPACE" || pressedKey === "DELETE") ? "DELETE" : pressedKey
    pressedKeyRef.current = pressedKey
    
    if (!keysArray.flat().includes(pressedKey)) return

    //to delete
    if (gridIndex !== 0 && pressedKey === "DELETE") removeCharacter()

    //blocks users from moving onto next row without typing "Enter" (if on fifth tile)
    if (gridIndex !== gridRow.start && gridIndex > gridRow.finish && pressedKey !== "ENTER") return

    //only when they hit "ENTER" when at the end of the row can they move forward
    if (gridIndex !== gridRow.start && gridIndex % 5 === 0 && pressedKey === "ENTER") {
      setRowIndex(0)
      setTooShort(false)
      setUserAnswer("")
      compareAnswer()
    }

    //the row is not yet filled but the user presses ENTER => no input
    if (pressedKey === "ENTER" && gridIndex !== gridRow.finish + 1) {
      setTooShort(true)
      return
    }

    //if input passess all conditions, have the character appear in the corresponding tile
    if (
        pressedKey !== "ENTER" &&
        pressedKey !== "DELETE"
      ) {
      addCharacter(pressedKey)
    } 
  }

  useEffect(() => {
    if (gridIndex < 30 && userAnswer === answer && pressedKeyRef.current === "ENTER") {
      setGameState({play: false, status: "Win"})
    } else if (gridIndex === 30 && userAnswer !== answer && pressedKeyRef.current === "ENTER") {
      setGameState({play: false, status: "Lose"})
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

  }, [rowIndex, tooShort, gridRow, userAnswer])

  return (
    <div className="App">
      <div className="navbar">Wordle Clone</div>
      <Tiles grid={grid} colorTile={colorTile} animateTile={animateTile} />
      <Key keysArray={keysArray} colorKey={colorKey} handleInput={handleInput}/>
      {tooShort && <div className="toggleShortMessage">Too short</div>}
      {!gameState.play && 
      <div className="toggleShortMessage">
        <p>{`You ${gameState.status}!`}</p>
        <button onClick={resetGame}>Play Again</button>
      </div>}
    </div>
  )
}