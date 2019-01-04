import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../../../contexts/FlashContext'
import useErrorHandler from '../../../../hooks/useErrorHandler'
import { ILesson } from '../../../../sharedTypes'
import api from '../../../../utils/api'
import { numericSort } from '../../../../utils/string'

const useLessons = (resourceId?: string) => {
  const [lessons, setLessons] = React.useState<ILesson[]>([])
  const { handleError } = useErrorHandler()
  React.useEffect(() => {
    if (resourceId) {
      api.lessons
        .get(resourceId)
        .then(l => setLessons(l))
        .catch(handleError)
    }
  }, [])

  const flashContext = React.useContext(FlashContext)

  const updateLessons = ({
    _id,
    action,
    lesson,
  }: {
    _id?: string
    action: 'create' | 'update' | 'delete'
    lesson?: ILesson
  }) => {
    let newLessons: ILesson[] = []
    if (action === 'update' && lesson) {
      newLessons = map(lessons, r => (r._id === lesson._id ? lesson : r))
      flashContext.set({ message: 'Lesson Updated Successfully' })
    } else if (action === 'create' && lesson) {
      const unsorted = [lesson, ...lessons]
      newLessons = numericSort(unsorted, 'title')
      flashContext.set({ message: 'Lesson Created Successfully' })
    } else if (action === 'delete') {
      newLessons = filter(lessons, r => r._id !== _id)
      flashContext.set({ message: 'Lesson Deleted Successfully' })
      setLessons(newLessons)
    }
  }
  return { lessons, updateLessons }
}

export default useLessons
