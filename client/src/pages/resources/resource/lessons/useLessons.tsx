import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../../../contexts/FlashContext'
import { IApiError, ILesson } from '../../../../sharedTypes'
import api from '../../../../utils/api'
import { numericSort } from '../../../../utils/string'

export type IUpdateLessons = ({
  _id,
  action,
  lesson,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete' | 'close'
  lesson?: ILesson
}) => void

export type TSetModalState = ({ action, lesson, resourceId }: IModalState) => void

export interface IModalState {
  action: 'create' | 'update' | 'close'
  lesson?: ILesson
  resourceId: string
  timesDeleteClicked?: number
}

export interface IModalController {
  handleError: (err: IApiError) => void
  incTimesDeleteClicked: () => void
  reset: () => void
  set: TSetModalState
  state: IModalState
  updateLessons: IUpdateLessons
}

const useLessons = (handleError: (err: IApiError) => void, resourceId?: string) => {
  const [lessons, setLessons] = React.useState<ILesson[]>([])
  const flashContext = React.useContext(FlashContext)

  const initialModalState = { lesson: undefined, action: 'close' as 'close', resourceId: '', timesDeleteClicked: 0 }
  const [modalState, setModalState] = React.useState<IModalState>(initialModalState)

  React.useEffect(() => {
    if (resourceId) {
      api.lessons
        .get(resourceId)
        .then(l => setLessons(l))
        .catch(handleError)
    }
  }, [])

  const updateLessons: IUpdateLessons = ({ _id, action, lesson }) => {
    let newLessons: ILesson[] = []
    if (action === 'update' && lesson) {
      newLessons = map(lessons, l => (l._id === lesson._id ? lesson : l))
      flashContext.set({ message: 'Lesson Updated Successfully' })
    } else if (action === 'create' && lesson) {
      const unsorted = [lesson, ...lessons]
      newLessons = numericSort(unsorted, 'title')
      flashContext.set({ message: 'Lesson Created Successfully' })
    } else if (action === 'delete') {
      newLessons = filter(lessons, r => r._id !== _id)
      flashContext.set({ message: 'Lesson Deleted Successfully' })
    }
    setLessons(newLessons)
  }

  const modalController: IModalController = {
    handleError,
    incTimesDeleteClicked: () => setModalState({ ...modalState, timesDeleteClicked: 1 }),
    reset: () => setModalState(initialModalState),
    set: setModalState,
    state: modalState,
    updateLessons,
  }

  return { lessons, modalController }
}

export default useLessons
