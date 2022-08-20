import { useEffect, useState } from 'react'
import './../../App.css'
import axios from 'axios';

function index() {
  const [loadExplore, setLoadExplorer] = useState(false)
  const [displayText, setDisplayText] = useState(false);
  const [accordianElem, setAccordianElem] = useState([]);
  const [indentSpace, setIndentSpace] = useState(40);
  const [currentItem, setCurrentItem] = useState('');

  const [files, setfiles] = useState({
    "name": "root"
  })



  function initializeDataRecursively(obj, property, entries, toggle, reloadExplorer = true, isSetfiles = true) {

    for (var i = 0; i <= Object.keys(obj).length; i++) {
      var key = Object.keys(obj)[i];
      console.log(`key: ${key}, value: ${obj[key]}`)

      if (Array.isArray(obj)) {
        var tempKey = key;
        key = obj.findIndex((e) => e.name == property)
        if (key < 0) {
          key = tempKey;
        }
      }

      if (obj[key] == property) {
        obj.entries = entries;
        obj.isActive = toggle;
        if (!obj.isActive) {
          delete obj.isActive;
        }
        if (isSetfiles)
        initializeDataRecursively(files, property, obj.entries, toggle, reloadExplorer = true, false)


        if (reloadExplorer)
          setLoadExplorer(!loadExplore);
        break;
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        initializeDataRecursively(obj[key], property, entries, toggle, reloadExplorer = false, isSetfiles)
      }
    }
  }

  useEffect(() => {
    getAccordionItem(files)
  }, [loadExplore])

  return (
    <div className="App">
      <h1>React Accordion Demo</h1>
      <div className="accordion">
        {
          accordianElem &&
          accordianElem
        }
        <div id="overlay" onClick={() => {

           setDisplayText("")
            document.getElementById("overlay").style.display = "none"
        }}>
          <div id="text">{displayText}</div>
        </div>
      </div>
    </div>
  )

  function getFiles(query) {
    return axios.get(`http://0.0.0.0:8080/paths/${query}`)
  }

  function onExpandIconClick(item, toggle) {
    var currentItem = item.currentTarget.getAttribute('data-item');
    setCurrentItem(currentItem);
    var isActive = item.currentTarget.getAttribute('data-isactive') == null ? true : !Boolean(item.currentTarget.getAttribute('data-isActive'))
    getFiles(currentItem)
      .then((resp) => {
        resp.data.name = resp.data.id;
        delete resp.data.id;
        console.log(resp.data);
        initializeDataRecursively(files, currentItem, resp.data.entries, isActive)
      })
  }

  function getAccordionItem(data) {
    // if (files?.entries && files.isActive) {
    //    var item = iterate(files, files?.name, files.entries, files.isActive, false);
    // }
    getItemsRecursively([files], [])
  }

  function getItemsRecursively(entries = [], prevValues = [], spacing, classname) {
    var element = prevValues;
    for (var i = 0; i <= entries.length; i++) {
      let name = entries[i]?.name;
      if (name == null || name == undefined) {
        break;
      }
      let currentTarget;
      element.push(
        <div className="accordion-item" key={entries[i]?.name+i+Math.random()}>
          {
            //entries[i]?.entries?.length >0 &&
            <div className={'accordion-icon'} data-item={entries[i]?.name} data-isactive={entries[i]?.isActive} onClick={(e) => onExpandIconClick(e, entries[i]?.isActive)}>{ entries[i]?.type != 'file' ?entries[i]?.isActive ? "-" : "+" :''}</div>
          }
          <a className='accordion-title' data-type={entries[i]?.type} data-contents={entries[i]?.contents} onClick={(e) => {
            if(e.currentTarget.dataset.type === 'file'){
            setDisplayText(e.currentTarget.dataset.contents)
            document.getElementById("overlay").style.display = "block"
            }
          
          }}>{entries[i]?.name}</a>
        </div>)
      if (entries[i]?.entries && entries[i]?.isActive) {
        getItemsRecursively(entries[i]?.entries, element, indentSpace, "accordian-sub-item");
        setIndentSpace(indentSpace + indentSpace);
      }
    }
    
    return setAccordianElem(element);

  }
}


export default index
