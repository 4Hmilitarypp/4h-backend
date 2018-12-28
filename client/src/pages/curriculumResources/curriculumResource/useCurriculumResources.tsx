import { filter, map } from 'lodash'
import * as React from 'react'
import { ICurriculumResource, IDisplayCurriculumResource } from '../../../sharedTypes'
import api from '../../../utils/api'

export const useCurriculumResources = ({ setSubmitted, setSuccessMessage }: any) => {
  const [curriculumResources, setCurriculumResources] = React.useState<
    ICurriculumResource[] | IDisplayCurriculumResource[] | undefined
  >(undefined)
  React.useEffect(() => {
    api.curriculumResource
      .get()
      .then(r => setCurriculumResources(r))
      .catch(err => console.error(err))
  }, [])
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
      let newCurriculumResources: ICurriculumResource[] | IDisplayCurriculumResource[] = []
      if (action === 'update' && curriculumResource) {
        newCurriculumResources = map(curriculumResources, r =>
          r._id === curriculumResource._id ? curriculumResource : r
        )
        setSuccessMessage('Curriculum Resource Updated Successfully')
        setSubmitted(true)
      } else if (action === 'create' && curriculumResource) {
        newCurriculumResources = [curriculumResource, ...curriculumResources]
        setSuccessMessage('Curriculum Resource Created Successfully')
        setSubmitted(true)
      } else if (action === 'delete') {
        newCurriculumResources = filter(curriculumResources, r => r._id !== _id)
        setSuccessMessage('Curriculum Resource Deleted Successfully')
        setSubmitted(true)
      }
      setCurriculumResources(newCurriculumResources)
    }
  }
  return { curriculumResources, setCurriculumResources: updateCurriculumResources }
}
