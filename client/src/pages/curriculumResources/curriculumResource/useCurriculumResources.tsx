import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../../contexts/FlashContext'
import { ICurriculumResource } from '../../../sharedTypes'
import api from '../../../utils/api'

const useCurriculumResources = () => {
  const [curriculumResources, setCurriculumResources] = React.useState<ICurriculumResource[] | undefined>(undefined)
  React.useEffect(() => {
    api.curriculumResources
      .get()
      .then(r => setCurriculumResources(r))
      .catch(err => console.error(err))
  }, [])

  const flashContext = React.useContext(FlashContext)

  const updateCurriculumResources = ({
    _id,
    action,
    curriculumResource,
  }: {
    _id?: string
    action: 'create' | 'update' | 'delete'
    curriculumResource?: ICurriculumResource
  }) => {
    if (curriculumResources) {
      let newCurriculumResources: ICurriculumResource[] = []
      if (action === 'update' && curriculumResource) {
        newCurriculumResources = map(curriculumResources, r =>
          r._id === curriculumResource._id ? curriculumResource : r
        )
        flashContext.set({ message: 'Curriculum Resource Updated Successfully' })
      } else if (action === 'create' && curriculumResource) {
        newCurriculumResources = [curriculumResource, ...curriculumResources]
        flashContext.set({ message: 'Curriculum Resource Created Successfully' })
      } else if (action === 'delete') {
        newCurriculumResources = filter(curriculumResources, r => r._id !== _id)
        flashContext.set({ message: 'Curriculum Resource Deleted Successfully' })
      }
      setCurriculumResources(newCurriculumResources)
    }
  }
  return { curriculumResources, updateCurriculumResources }
}
export default useCurriculumResources
