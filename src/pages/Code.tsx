import { useState } from 'react'

const DEFAULT = [1, 2, 3, 4, 5]

const toggleArrayItem = (arr, val) => {
  return arr.includes(val) ? arr.filter((el) => el !== val) : [...arr, val]
}

function Code() {
  const [items, setItems] = useState(DEFAULT)
  const [inputValue, setInputValue] = useState('')

  const handleToggle = (num) => {
    return () => {
      setItems(toggleArrayItem(items, num))
      console.log('🤩 Code items:', items)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue) return
    const number = parseInt(inputValue)
    if (isNaN(number)) return
    setItems(toggleArrayItem(items, number))
    setInputValue('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <input type="submit" value="Toggle" />
      </form>
      {items.map((item) => (
        <button key={item} onClick={() => handleToggle(item)}>
          {item} {items.includes(item) ? '✅' : '❌'}
        </button>
      ))}
    </div>
  )
}

export default Code
