import { useEffect, useState } from 'react'
import FileEplorer from './views/file_explorer'
import './App.css'
import axios from 'axios';

function App() {

  //Todo: route implementation
  return (
    <div className="App">
      <FileEplorer />
    </div>
  )
}


export default App
