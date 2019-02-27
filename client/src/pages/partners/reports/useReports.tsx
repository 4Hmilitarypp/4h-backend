import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../../contexts/FlashContext'
import { IApiError, IReport } from '../../../sharedTypes'
import api from '../../../utils/api'
import { numericSort } from '../../../utils/string'

export type IUpdateReports = ({
  _id,
  action,
  report,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete' | 'close'
  report?: IReport
}) => void

export type TSetModalState = ({ action, report, partnerId }: IModalState) => void

export interface IModalState {
  action: 'create' | 'update' | 'close'
  report?: IReport
  partnerId: string
}

export interface IModalController {
  handleError: (err: IApiError) => void
  reset: () => void
  set: TSetModalState
  state: IModalState
  updateReports: IUpdateReports
}

const useReports = (handleError: (err: IApiError) => void, partnerId: string) => {
  const [reports, setReports] = React.useState<IReport[]>([])
  const flashContext = React.useContext(FlashContext)

  const initialModalState = { report: undefined, action: 'close' as 'close', partnerId: '' }
  const [modalState, setModalState] = React.useState<IModalState>(initialModalState)

  React.useEffect(() => {
    if (partnerId) {
      api.reports
        .get(partnerId)
        .then(r => setReports(r))
        .catch(handleError)
    }
  }, [])

  const updateReports: IUpdateReports = ({ _id, action, report }) => {
    let newReports: IReport[] = []
    if (action === 'update' && report) {
      newReports = map(reports, l => (l._id === report._id ? report : l))
      flashContext.set({ message: 'Report Updated Successfully' })
    } else if (action === 'create' && report) {
      const unsorted = [report, ...reports]
      newReports = numericSort(unsorted, 'title')
      flashContext.set({ message: 'Report Created Successfully' })
    } else if (action === 'delete') {
      newReports = filter(reports, r => r._id !== _id)
      flashContext.set({ message: 'Report Deleted Successfully' })
      setReports(newReports)
    }
  }

  const modalController: IModalController = {
    handleError,
    reset: () => setModalState(initialModalState),
    set: setModalState,
    state: modalState,
    updateReports,
  }

  return { reports, modalController }
}

export default useReports
