import { useState, useRef } from 'react'
import Togglable from './Togglable'

const NoteForm = ({ addNote, handleLogout }) => {
  const [newNote, setNewNote] = useState('')
  const toggableRef = useRef()

  const handleSubmit = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: false
    }

    addNote(noteObject)
    setNewNote('')
    toggableRef.current.toggleVisibility()
  }
  return (
    <Togglable ref={toggableRef} buttonLabel='New Note'>
      <h3>Create a new note </h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder='Write your note content'
          value={newNote}
          onChange={({ target }) => setNewNote(target.value)}
        />
        <button type='submit'>save</button>
      </form>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </Togglable>
  )
}

export default NoteForm
