import { useEffect, useReducer } from "react";
import { useAuth } from "../../contexts/AuthContext";

const ACTIONS = {
  SELECT_FOLDER: 'select-folder',
  UPDATE_FOLDER: 'update-folder',
  SET_CHILD_FOLDERS: 'set-child-folders',
  SET_CHILD_FIles: 'set-child-files',
}

export const ROOT_FOLDER = { name: "Root", $id: null, path: [] }

function reducer(state, {type, payload}) {
  switch(type) {
    
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFiles: [],
        childFolders: []
      }

    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder
      }

    case ACTIONS.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders
      }

    case ACTIONS.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles
      }

    default:
      return state
  }
}

export function useFolder(folderId = null, folder = null) {
  const { currentUser, getDocument, listDocuments } = useAuth()
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: []
  })

  useEffect(() => {
    dispatch({
      type: ACTIONS.SELECT_FOLDER,
      payload: {folderId, folder}
    })
  }, [folderId, folder])

  useEffect(() => {
    if(folderId== null) {
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER }
      })
    }

    getDocument(process.env.REACT_APP_FOLDERS_COLLECTION_ID, folderId).then(doc => {
      dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: doc }
      })
    }).catch(() => {
      dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER }
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId])

  useEffect(() => {
    listDocuments(process.env.REACT_APP_FOLDERS_COLLECTION_ID, [`parentId=${folderId}`]).then(res => {
      dispatch({
        type: ACTIONS.SET_CHILD_FOLDERS,
        payload: { childFolders: res.documents}
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, currentUser])

  useEffect(() => {
    listDocuments(process.env.REACT_APP_FILES_COLLECTION_ID, [`folderId=${folderId}`]).then(res => {
      dispatch({
        type: ACTIONS.SET_CHILD_FILES,
        payload: { childFiles: res.documents}
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, currentUser])

  return state
}