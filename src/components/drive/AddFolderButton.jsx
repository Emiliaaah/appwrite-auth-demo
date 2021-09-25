import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'
import { ROOT_FOLDER } from '../hooks/useFolder'

export default function AddFolderButton({ currentFolder }) {
  const { currentUser, createDocument } = useAuth()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (currentFolder == null) return

    const path = currentFolder.path ? [...currentFolder.path] : []
    if (currentFolder !== ROOT_FOLDER) {
      path.push({name: currentFolder.name, id: currentFolder.$id})
    }
    try {
      createDocument(process.env.REACT_APP_FOLDERS_COLLECTION_ID, {
        name: name,
        parentId: currentFolder.$id ?? "null",
        userId: currentUser.$id,
        path: path,
        createdAt: new Date()
      })
    } catch(err) {
      console.log(err)
    }
    setName("")
    closeModal()
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-success">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}></Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Close</Button>
            <Button variant="success" type="submit">Add Folder</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
