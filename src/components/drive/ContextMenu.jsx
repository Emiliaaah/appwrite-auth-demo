import React from "react";
import { useAuth } from "../../contexts/AuthContext";

import useContextMenu from "../hooks/useContextMenu";

const Menu = ({ outerRef, childFiles }) => {
  const { xPos, yPos, menu, target } = useContextMenu(outerRef);
  const { deleteFile, deleteDocument } = useAuth()

  function handleClick(e) {
    const action = e.target.firstChild.data
    // eslint-disable-next-line array-callback-return
    const file = childFiles.filter(file => {
      if (file.$id === target) return file 
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
  }

  if (menu) {
    return (
      <ul className="menu" style={{ top: yPos, left: xPos }}>
        <li onClick={handleClick}>Open</li>
        <li onClick={handleClick}>Download</li>
        <li onClick={handleClick}>Delete</li>
      </ul>
    );
  }
  return <></>;
};

export default Menu;