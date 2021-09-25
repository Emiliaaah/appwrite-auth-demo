import { useEffect, useReducer } from "react";
import { useAuth } from "../../contexts/AuthContext";
import app from "../../utils/appwrite";

const ACTIONS = {
  SELECT_FOLDER: 'select-folder',
  UPDATE_FOLDER: 'update-folder',
  SET_CHILD_FOLDERS: 'set-child-folders',
  SET_CHILD_FIles: 'set-child-files',
  APPEND_CHILD_FOLDERS: 'append-child-folders',
  APPEND_CHILD_FILES: 'append-child-files',
  DELETE_CHILD_FOLDER: 'delete-child-folder',
  DELETE_CHILD_FILE: 'delete-child-file',
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

    case ACTIONS.APPEND_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: [...state.childFolders, payload.childFolders]
      }

    case ACTIONS.APPEND_CHILD_FILES:
      return {
        ...state,
        childFiles: [...state.childFiles, payload.childFiles]
      }

    case ACTIONS.DELETE_CHILD_FOLDER:
      return {
        ...state,
        childFolders: state.childFolders.filter(folder => {
          // eslint-disable-next-line array-callback-return
          if (folder.$id === payload.childFolder.$id) return
          else return folder
        })
      }

    case ACTIONS.DELETE_CHILD_FILE:
      return {
        ...state,
        childFiles: state.childFiles.filter(file => {
          // eslint-disable-next-line array-callback-return
          if (file.$id === payload.childFile.$id) return
          else return file
        })
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

  useEffect(() => {
    app.subscribe(`collections.${process.env.REACT_APP_FILES_COLLECTION_ID}.documents`, response => {
      if (response.event === "database.documents.create") {
        dispatch({
          type: ACTIONS.APPEND_CHILD_FILES,
          payload: { childFiles: response.payload}
        })
      }
      if (response.event === "database.documents.delete") {
        dispatch({
          type: ACTIONS.DELETE_CHILD_FILE,
          payload: { childFile: response.payload}
        })
      }
    })

    app.subscribe(`collections.${process.env.REACT_APP_FOLDERS_COLLECTION_ID}.documents`, response => {
      if (response.event === "database.documents.create") {
        dispatch({
          type: ACTIONS.APPEND_CHILD_FOLDERS,
          payload: { childFolders: response.payload}
        })
      }
      if (response.event === "database.documents.delete") {
        dispatch({
          type: ACTIONS.DELETE_CHILD_FOLDER,
          payload: { childFolder: response.payload}
        })
      }
    })

  }, [])

  return state
}