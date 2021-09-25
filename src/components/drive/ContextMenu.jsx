import { faEye, faFileDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

import useContextMenu from "../hooks/useContextMenu";

const Menu = ({ outerRef, childFiles, childFolders }) => {
  const { xPos, yPos, menu, target } = useContextMenu(outerRef);
  const { deleteFile, deleteDocument } = useAuth()
  const history = useHistory()

  function handleClick(e) {
    const action = e.target.textContent
    if (target.type === "file") {
      // eslint-disable-next-line array-callback-return
      const file = childFiles.filter(file => {
        if (file.$id === target.id) return file 
      })

      switch (action.toLowerCase()) {
        case 'open':
          window.location.assign(file[0].viewUrl)
          break

        case 'download':
          window.open(file[0].downloadUrl, "_blank")
          break

        case 'delete':
          deleteFile(file[0].fileId)
          deleteDocument(process.env.REACT_APP_FILES_COLLECTION_ID, file[0].$id)
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
          <FontAwesomeIcon icon={faTrash} className="me-2"/>
          Delete
        </li>
      </ul>
    );
  }
  return <></>;
};

export default Menu;