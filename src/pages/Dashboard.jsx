import React, { useRef } from 'react'
import { Container } from 'react-bootstrap'
import AddFolderButton from '../components/drive/AddFolderButton'
import Navbar from '../components/drive/Navbar'
import { useFolder } from '../components/hooks/useFolder'
import { useParams, useLocation } from 'react-router-dom'
import FolderBreadcrumbs from '../components/drive/FolderBreadcrumbs'
import AddFileButton from '../components/drive/AddFileButton'
import Folder from '../components/drive/Folder'
import File from '../components/drive/File'
import Menu from '../components/drive/ContextMenu'

export function Dashboard() {
  const { folderId } = useParams()
  const { state= {} } = useLocation()
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder)
  const outerRef = useRef(null);

  return (
    <>
      <Navbar />
      <Container ref={outerRef} fluid> 
        <Menu outerRef={outerRef} childFiles={childFiles} childFolders={childFolders} />
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
    </>
  )
}
