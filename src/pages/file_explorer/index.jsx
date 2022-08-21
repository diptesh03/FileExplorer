import { useEffect, useState } from 'react'
import FileExplorer from '../../components/file_explorer'
import axios from 'axios';

function index() {

    function getFiles(query) {
        return axios.get(`http://0.0.0.0:8080/paths/${query}`)
      }
  return (
      <FileExplorer  getFiles={getFiles} defaultFolder="root" />
  )
}


export default index
