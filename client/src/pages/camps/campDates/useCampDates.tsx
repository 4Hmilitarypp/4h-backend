import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../../contexts/FlashContext'
import { IApiError, ICampDate } from '../../../sharedTypes'
import api from '../../../utils/api'
import { numericSort } from '../../../utils/string'

export type IUpdateCampDates = ({
  _id,
  action,
  campDate,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete' | 'close'
  campDate?: ICampDate
}) => void

export type TSetModalState = (args: IModalState) => void

export interface IModalState {
  action: 'create' | 'update' | 'close'
  campDate?: ICampDate
  campId: string
  timesDeleteClicked?: number
}

export interface IModalController {
  handleError: (err: IApiError) => void
  incTimesDeleteClicked: () => void
  reset: () => void
  set: TSetModalState
  state: IModalState
  updateCampDates: IUpdateCampDates
}

const useCampDates = (handleError: (err: IApiError) => void, campId?: string) => {
  const [campDates, setCampDates] = React.useState<ICampDate[]>([])
  const flashContext = React.useContext(FlashContext)

  React.useEffect(() => {
    if (campId) {
      api.campDates
        .get(campId)
        .then(r => setCampDates(r))
        .catch(handleError)
    }
  }, [campId, handleError])

  const initialModalState = { campDate: undefined, action: 'close' as 'close', campId: '', timesDeleteClicked: 0 }
  const [modalState, setModalState] = React.useState<IModalState>(initialModalState)

  const updateCampDates: IUpdateCampDates = ({ _id, action, campDate }) => {
    let newCampDates: ICampDate[] = []
    if (action === 'update' && campDate) {
      newCampDates = map(campDates, l => (l._id === campDate._id ? campDate : l))
      flashContext.set({ message: 'Camp Date Updated Successfully' })
    } else if (action === 'create' && campDate) {
      const unsorted = [campDate, ...campDates]
      newCampDates = numericSort(unsorted, 'beginDate')
      flashContext.set({ message: 'Camp Date Created Successfully' })
    } else if (action === 'delete') {
      newCampDates = filter(campDates, r => r._id !== _id)
      flashContext.set({ message: 'Camp Date Deleted Successfully' })
      modalController.reset()
    }
    setCampDates(newCampDates)
  }

  const modalController: IModalController = {
    handleError,
    incTimesDeleteClicked: () => setModalState({ ...modalState, timesDeleteClicked: 1 }),
    reset: () => setModalState(initialModalState),
    set: setModalState,
    state: modalState,
    updateCampDates,
  }

  return { campDates, modalController }
}

export default useCampDates
