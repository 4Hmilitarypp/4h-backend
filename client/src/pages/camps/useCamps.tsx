import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../contexts/FlashContext'
import useErrorHandler from '../../hooks/useErrorHandler'
import usePermission from '../../hooks/usePermission'
import { ICamp } from '../../sharedTypes'
import api from '../../utils/api'
import { numericSort } from '../../utils/string'

export type TUpdateCamps = ({
  _id,
  action,
  camp,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete'
  camp?: ICamp
}) => void

const useCamps = () => {
  usePermission('admin')
  const handleError = useErrorHandler()

  const [camps, setCamps] = React.useState<ICamp[]>([])
  React.useEffect(() => {
    api.camps
      .get()
      .then(c => setCamps(c))
      .catch(handleError)
  }, [])

  const flashContext = React.useContext(FlashContext)

  const updateCamps: TUpdateCamps = ({ _id, action, camp }) => {
    let newCamps: ICamp[] = []
    if (action === 'update' && camp) {
      newCamps = map(camps, r => (r._id === camp._id ? camp : r))
      flashContext.set({ message: 'Camp Updated Successfully' })
    } else if (action === 'create' && camp) {
      const unsorted = [camp, ...camps]
      newCamps = numericSort(unsorted, 'title')
      flashContext.set({ message: 'Camp Created Successfully' })
    } else if (action === 'delete') {
      newCamps = filter(camps, c => c._id !== _id)
      flashContext.set({ message: 'Camp Deleted Successfully' })
    }
    setCamps(newCamps)
  }
  return { handleError, camps, updateCamps }
}
export default useCamps
