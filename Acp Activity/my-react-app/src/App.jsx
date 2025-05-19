import { useState } from 'react'
import './App.css'
import SearchComponent from './components/SearchComponent'
import SubmitForm from './components/SubmitForm'
import UpdateForm from './components/UpdateForm'
import DeleteForm from './components/DeleteForm'

function App() {
  return (
    <div className="app-container">
      <h1>Feedback System</h1>
      
      <SubmitForm />
      <UpdateForm />
      <DeleteForm />
      <SearchComponent />
    </div>
  )
}

export default App
