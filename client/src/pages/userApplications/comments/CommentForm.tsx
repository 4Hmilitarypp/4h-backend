import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../../clientTypes'
import { InputGroup, ModalForm } from '../../../components/Elements'
import api from '../../../utils/api'
import { IModalController } from './useComments'

interface IProps {
  modalController: IModalController
}

const CommentForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateComments } = modalController
  const { comment, action } = modalController.state

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { text } = e.currentTarget.elements
    const updateComment = {
      _id: comment ? comment._id : undefined,
      text: text.value,
    }
    if (action === 'create') {
      api.comments
        .create(modalController.state.applicationId, updateComment)
        .then(newComment => {
          updateComments({ comment: newComment, action })
          resetModalState()
        })
        .catch(handleError)
    } else {
      api.comments
        .update(modalController.state.applicationId, updateComment._id as string, updateComment)
        .then(newComment => {
          updateComments({ comment: { ...newComment, userName: (comment as any).userName }, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }

  return (
    <ModalForm onSubmit={handleSubmit} id="commentForm">
      <CustomInputGroup>
        <input type="text" id="text" defaultValue={(comment && comment.text) || ''} />
      </CustomInputGroup>
    </ModalForm>
  )
}

export default CommentForm

const CustomInputGroup = styled(InputGroup)`
  margin: 2rem 0;
`
