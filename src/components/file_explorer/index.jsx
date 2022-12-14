import { useEffect, useState } from 'react'
import './../../App.css'

function index({ getFiles, defaultFolder = "root" }) {
  const [reload, setReload] = useState(false)
  const [content, setContent] = useState(false);
  const [treeView, setTreeView] = useState([]);
  const [files, setfiles] = useState({ "name": defaultFolder });

  useEffect(() => {
    getTreeView([files], []);
  }, [reload])

  return (
    <div className="App">
      <h1>File Explorer</h1>
      <div className="accordion">
        {
          treeView &&
          treeView
        }
        <div id="overlay" onClick={() => onItemClick('', 'none')}>
          <div id="text">{content}</div>
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
        initializeTreeData(files, currentItem, resp.data.entries, isActive)
      })
  }

  function onItemClick(text = '', value) {
    setContent(text);
    document.getElementById("overlay").style.display = value;
  }

  function getTreeView(entries = [], prevValues = [], space = 0) {
    var element = prevValues;
    for (var i = 0; i <= entries.length; i++) {
      let name = entries[i]?.name;
      if (name == null || name == undefined) {
        break;
      }
      element.push(
      <div style={{ marginLeft: space }} className="accordion-item" key={name + i}>
        {
          <div className="accordion-icon" data-item={name} data-isactive={entries[i]?.isActive} onClick={(e) => onExpandIconClick(e, entries[i]?.isActive)}>{entries[i]?.type != 'file' ? entries[i]?.isActive ? "-" : "+" : ''}</div>
        }
        <a className='accordion-title' data-type={entries[i]?.type} data-contents={entries[i]?.contents} onClick={(e) => {
          if (e.currentTarget.dataset.type === 'file') {
            onItemClick(e.currentTarget.dataset.contents || 'No Content', 'block')
          }
        }}>{name}</a>
      </div>
      )
      if (entries[i]?.entries && entries[i]?.isActive) {
        getTreeView(entries[i]?.entries, element, space + 30);
      }
    }
    return setTreeView(element);
  }

  function initializeTreeData(obj, property, entries, toggle, refresh = true, isSetfiles = true) {

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
          initializeTreeData(files, property, obj.entries, toggle, refresh = true, false)

        if (refresh)
          setReload(!reload);
        break;
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        initializeTreeData(obj[key], property, entries, toggle, refresh = false, isSetfiles)
      }
    }
  }

}

export default index
