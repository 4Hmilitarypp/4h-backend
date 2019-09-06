import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../../../contexts/FlashContext'
import { IApiError, IComment } from '../../../../sharedTypes'
import api from '../../../../utils/api'

export type IUpdateComments = ({
  _id,
  action,
  comment,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete' | 'close'
  comment?: IComment
}) => void

export type TSetModalState = (args: IModalState) => void

export interface IModalState {
  action: 'create' | 'update' | 'close'
  comment?: IComment
  applicationId: string
  timesDeleteClicked?: number
}

export interface IModalController {
  handleError: (err: IApiError) => void
  incTimesDeleteClicked: () => void
  reset: () => void
  set: TSetModalState
  state: IModalState
  updateComments: IUpdateComments
}

const useComments = (handleError: (err: IApiError) => void, applicationId?: string) => {
  const [comments, setComments] = React.useState<IComment[]>([])
  const flashContext = React.useContext(FlashContext)

  React.useEffect(() => {
    if (applicationId) {
      api.comments
        .get(applicationId)
        .then(r => setComments(r))
        .catch(handleError)
    }
  }, [applicationId]) // eslint-disable-line

  const initialModalState = { comment: undefined, action: 'close' as 'close', applicationId: '', timesDeleteClicked: 0 }
  const [modalState, setModalState] = React.useState<IModalState>(initialModalState)

  const updateComments: IUpdateComments = ({ _id, action, comment }) => {
    let newComments: IComment[] = []
    if (action === 'update' && comment) {
      newComments = map(comments, l => (l._id === comment._id ? comment : l))
      flashContext.set({ message: 'Comment Updated Successfully' })
    } else if (action === 'create' && comment) {
      newComments = [comment, ...comments]
      flashContext.set({ message: 'Comment Created Successfully' })
    } else if (action === 'delete') {
      newComments = filter(comments, r => r._id !== _id)
      flashContext.set({ message: 'Comment Deleted Successfully' })
      modalController.reset()
    }
    setComments(newComments)
  }

  const modalController: IModalController = {
    handleError,
    incTimesDeleteClicked: () => setModalState({ ...modalState, timesDeleteClicked: 1 }),
    reset: () => setModalState(initialModalState),
    set: setModalState,
    state: modalState,
    updateComments,
  }

  return { comments, modalController }
}

export default useComments
