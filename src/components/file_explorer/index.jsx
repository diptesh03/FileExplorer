import { useEffect, useState } from 'react'
import './../../App.css'
import axios from 'axios';

function index({ getFiles }) {
  const [reload, setReload] = useState(false)
  const [displayText, setDisplayText] = useState(false);
  const [treeView, setTreeView] = useState([]);

  const [files, setfiles] = useState({
    "name": "root"
  })

  useEffect(() => {
    getItemsRecursively([files], []);
  }, [reload])

  return (
    <div className="App">
      <h1>File Explorer</h1>
      <div className="accordion">
        {
          treeView &&
          treeView
        }
        <div id="overlay" onClick={() => onItemClick('','none')}>
          <div id="text">{displayText}</div>
        </div>
      </div>
    </div>
  )

  function onExpandIconClick(item, toggle) {
    var currentItem = item.currentTarget.getAttribute('data-item');
    var isActive = item.currentTarget.getAttribute('data-isactive') == null ? true : !Boolean(item.currentTarget.getAttribute('data-isActive'))
    getFiles(currentItem)
      .then((resp) => {
        resp.data.name = resp.data.id;
        delete resp.data.id;
        initializeDataRecursively(files, currentItem, resp.data.entries, isActive)
      })
  }

  function onItemClick(text='', value){
    setDisplayText(text);
    document.getElementById("overlay").style.display =  value;
  }

  function getItemsRecursively(entries = [], prevValues = [], space=0) {
    var element = prevValues;
    for (var i = 0; i <= entries.length; i++) {
      let name = entries[i]?.name;
      
      if (name == null || name == undefined) {
        break;
      }

      element.push(
        <div style={{marginLeft: space}} className="accordion-item" key={entries[i]?.name + i}>
          {
            <div className="accordion-icon" data-item={entries[i]?.name} data-isactive={entries[i]?.isActive} onClick={(e) => onExpandIconClick(e, entries[i]?.isActive)}>{entries[i]?.type != 'file' ? entries[i]?.isActive ? "-" : "+" : ''}</div>
          }
          <a className='accordion-title' data-type={entries[i]?.type} data-contents={entries[i]?.contents} onClick={(e) => {
            if (e.currentTarget.dataset.type === 'file') {
              onItemClick(e.currentTarget.dataset.contents || 'No Content', 'block')
            }
          }}>
            {entries[i]?.name}
          </a>
        </div>)
      if (entries[i]?.entries && entries[i]?.isActive) {
        getItemsRecursively(entries[i]?.entries, element, space + 30);
      }
    }

    return setTreeView(element);

  }


  function initializeDataRecursively(obj, property, entries, toggle, rereloadr = true, isSetfiles = true) {

    for (var i = 0; i <= Object.keys(obj).length; i++) {
      var key = Object.keys(obj)[i];

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

        if (!obj.isActive) 
          delete obj.isActive;

        if (isSetfiles)
          initializeDataRecursively(files, property, obj.entries, toggle, rereloadr = true, false)


        if (rereloadr)
          setReload(!reload);
          break;
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        initializeDataRecursively(obj[key], property, entries, toggle, rereloadr = false, isSetfiles)
      }
    }
  }

}


export default index
