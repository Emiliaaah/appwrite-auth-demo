import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import app from '../../utils/appwrite'

export default function AddFileButton({ currentFolder }) {
  const { currentUser, createFile, createDocument, listDocuments, getFilePreview, getFileDownload, getFileView, deleteFile, updateDocument } = useAuth()

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (currentFolder == null || file == null) return

    let result = await listDocuments(process.env.REACT_APP_FILES_COLLECTION_ID, [`folderId=${currentFolder.$id ?? "null"}`, `name=${file.name}`])
    if (result.documents[0]) {
      try {
        await deleteFile(result.documents[0].fileId)
      } catch {
        
      }
      let uploadedFile = await createFile(file, ["*"])
      await updateDocument(process.env.REACT_APP_FILES_COLLECTION_ID, result.documents[0].$id, {
        fileId: uploadedFile.$id,
        previewUrl: await getFilePreview(uploadedFile.$id),
        downloadUrl: await getFileDownload(uploadedFile.$id),
        viewUrl: await getFileView(uploadedFile.$id),
      })
    } else {
      const uploadTask = await app.storage.createFile(file, [`user:${currentUser.$id}`, '*'])
      let promise = await createDocument(process.env.REACT_APP_FILES_COLLECTION_ID, {
        fileId: uploadTask.$id,
        previewUrl: await getFilePreview(uploadTask.$id),
        downloadUrl: await getFileDownload(uploadTask.$id),
        viewUrl: await getFileView(uploadTask.$id),
        name: file.name,
        createdAt: new Date(),
        folderId: currentFolder.$id ?? "null",
        userId: currentUser.$id,
      })
      console.log(promise)
    }
  }

  return (
    <label className="btn btn-outline-success m-0 me-2">
      <FontAwesomeIcon icon={faFileUpload} />
      <input type="file" onChange={handleUpload} style={{ display: "none"}} />
    </label>
  )
}
