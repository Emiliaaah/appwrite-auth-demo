/* eslint-disable no-undef */
import { faCheckSquare, faClipboard, faEye, faFileDownload, faSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

import useContextMenu from "../hooks/useContextMenu";

const Menu = ({ outerRef, childFiles, childFolders, setError, setMessage }) => {
  const { xPos, yPos, menu, target } = useContextMenu(outerRef);
  const { getFile, updateFile, deleteFile, deleteDocument, listDocuments, updateDocument } = useAuth()
  const history = useHistory()

  // eslint-disable-next-line array-callback-return
  const file = childFiles.filter(file => {
    if (file.$id === target.id) return file 
  })
  
  async function handleClick(e) {
    const action = e.target.textContent
    if (target.type === "file") {

      switch (action.toLowerCase()) {
        case 'open':
          window.location.assign(file[0].viewUrl)
          break

        case 'download':
          const link = document.createElement('a');
          link.href = file[0].downloadUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break

        case 'delete':
          deleteFile(file[0].fileId)
          deleteDocument(process.env.REACT_APP_FILES_COLLECTION_ID, file[0].$id)
          break

        case 'public':
          updateDocument(process.env.REACT_APP_FILES_COLLECTION_ID, file[0].$id, {
            public: !file[0].public
          })
          let result = await getFile(file[0].fileId)
          var newReadPerms = result.$permissions.read.filter(perm => {
            // eslint-disable-next-line array-callback-return
            if (perm === "*") return 
            return perm
          })
          await updateFile(file[0].fileId, !file[0].public ? [...newReadPerms, "*"] : newReadPerms, result.$permissions.write)
          history.go(0)
          break

        case 'copy link':
          navigator.clipboard.writeText(file[0].viewUrl)
          setMessage("Copied link to clipboard")
          break

        default:
          return
      }
    } else {
      // eslint-disable-next-line array-callback-return
      const folder = childFolders.filter(folder => {
        if (folder.$id === target.id) return folder 
      })

      switch (action.toLowerCase()) {
        case 'open':
          history.push(`/folder/${folder[0].$id}`)
          break

        case 'delete':
          let hasChildFiles =  await listDocuments(process.env.REACT_APP_FILES_COLLECTION_ID, [`folderId=${folder[0].$id}`])
          let hasChildFolders = await listDocuments(process.env.REACT_APP_FOLDERS_COLLECTION_ID, [`parentId=${folder[0].$id}`])

          if (hasChildFiles.sum !== 0 || hasChildFolders.sum !== 0) return setError("Directory is not empty")
          deleteDocument(process.env.REACT_APP_FOLDERS_COLLECTION_ID, folder[0].$id)
          break

        default:
          return
      }
    }
  }

  if (menu) {
    if (target.type === "folder") {
      return (
        <ul className="menu" style={{ top: yPos, left: xPos }}>
          <li onClick={handleClick}>
            <FontAwesomeIcon icon={faEye} className="me-2" />
            Open
          </li>
          <li onClick={handleClick}>
            <FontAwesomeIcon icon={faTrash} className="me-2"/>
            Delete
          </li>
        </ul>
      );
    }
    return (
      <ul className="menu" style={{ top: yPos, left: xPos }}>
        <li onClick={handleClick}>
          <FontAwesomeIcon icon={faEye} className="me-2" />
          Open
        </li>
        <li onClick={handleClick}>
          <FontAwesomeIcon icon={faFileDownload} className="me-2" />
          Download
        </li>
        <li onClick={handleClick}>
          <FontAwesomeIcon icon={faClipboard} className="me-2" />
          Copy Link
        </li>
        <li onClick={handleClick}>
          {file[0].public ? <FontAwesomeIcon icon={faCheckSquare} className="me-2" /> : <FontAwesomeIcon icon={faSquare} className="me-2" />}
          Public
        </li>
        <li onClick={handleClick}>
          <FontAwesomeIcon icon={faTrash} className="me-2"/>
          Delete
        </li>
      </ul>
    );
  }
  return <></>;
};

export default Menu;