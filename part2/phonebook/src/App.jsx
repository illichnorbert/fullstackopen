import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>name: <input value={props.newName} onChange={props.handleNameChange} /></div>
      <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = (props) => {
  return (
    <ul>
      {props.persons.map(person =>
        <li key={person.name}>{person.name} {person.number}
        <button onClick= {() => props.deletePerson(person.id, person.name)}> delete 
        </button>
        </li>
      )}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


 useEffect(() => {
  personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)  // Daten in State speichern
      })
  }, [])


const handleNameChange = (event) => {
  setNewName(event.target.value)
}

const handleNumberChange = (event) => {
  setNewNumber(event.target.value)
}

const addPerson = (event) => {

  event.preventDefault()
  const Exist = persons.find(person => person.name == newName)
  if (Exist) {
    if (window.confirm(`${newName} is already added, replace number?`)) {
      const updatedPerson = { ...Exist, number: newNumber }

      personService
        .update(Exist.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p =>
            p.id !== Exist.id ? p : returnedPerson
          ))
          setSuccessMessage(`Updated ${returnedPerson.name}`)
          setTimeout(() => setSuccessMessage(null), 5000)
          setNewName('')
          setNewNumber('')
        })
          .catch(error => { setErrorMessage (`Information of ${Exist.name} has already been removed from server`)
          setTimeout(() => setErrorMessage(null), 5000)          
          setPersons(persons.filter(p => p.id !== Exist.id))
        })
      }
    return
  }

  const personObject = {
    name: newName,
    number: newNumber}
   
  personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))  // Kann direkt Daten vom Server als returnedPerson nutzen!
      setNewNumber('')
      setNewName('')
      setSuccessMessage(`Added ${returnedPerson.name}`)
      setTimeout ( () => { setSuccessMessage(null) }, 5000 )
    })
    .catch(error => {
    setErrorMessage(error.response.data.error)
    setTimeout(() => setErrorMessage(null), 5000)
  })

}

const deletePerson = (id, name) => {
  if (window.confirm(`Delete ${name}?`)) {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }
}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {successMessage} type = "success" />
      <Notification message = {errorMessage} type = "error" />
      <PersonForm
      addPerson={addPerson}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <ul>
      <Persons persons={persons} deletePerson={deletePerson} />
      </ul>
    </div>
  )
}

export default App      