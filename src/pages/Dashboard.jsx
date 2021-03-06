import React, { useRef, useState } from 'react'
import { Alert, Container } from 'react-bootstrap'
import AddFolderButton from '../components/drive/AddFolderButton'
import Navbar from '../components/drive/Navbar'
import { useFolder } from '../components/hooks/useFolder'
import { useParams, useLocation } from 'react-router-dom'
import FolderBreadcrumbs from '../components/drive/FolderBreadcrumbs'
import AddFileButton from '../components/drive/AddFileButton'
import Folder from '../components/drive/Folder'
import File from '../components/drive/File'
import Menu from '../components/drive/ContextMenu'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css';


export function Dashboard() {
  const { folderId } = useParams()
  const { state= {} } = useLocation()
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder)
  const outerRef = useRef(null);
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  function handleSetError(message) {
    setError(message)
    setTimeout(() => {
      setError("")
    }, 10000)
  }

  function handleSetMessage(message) {
    setMessage(message)
    setTimeout(() => {
      setMessage("")
    }, 10000)
  }

  return (
    <>
      <Navbar />
      <Container ref={outerRef} fluid> 
        <Menu outerRef={outerRef} childFiles={childFiles} childFolders={childFolders} setError={handleSetError} setMessage={handleSetMessage}/>
        <div className="d-flex align-items-center pt-4">
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
          <AddFolderButton currentFolder={folder} />
        </div>
        {childFolders.length > 0 && (
        <div className="d-flex flex-wrap">
          {childFolders.map(childFolder => (
            <div key={childFolder.$id} id={childFolder.$id} style={{maxWidth: "250px"}} className="p-2 folder">
              <Folder folder={childFolder} />
            </div>
          ))}
        </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map(childFile => (
              <div key={childFile.$id} id={childFile.$id} style={{maxWidth: "250px"}} className="p-2 file">
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
      </Container>
      {error && ReactDOM.createPortal(
        <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          maxWidth: "250px"
        }}
        >
          <Alert variant="danger">{error}</Alert>
        </div>, document.body
      )}
      {message && ReactDOM.createPortal(
        <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          maxWidth: "250px"
        }}
        >
          <Alert variant="success">{message}</Alert>
        </div>, document.body
      )}
    </>
  )
}
