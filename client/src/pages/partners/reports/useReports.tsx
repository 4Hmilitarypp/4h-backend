import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../../contexts/FlashContext'
import { IApiError, IReport } from '../../../sharedTypes'
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

export type TSetModalState = (args: IModalState) => void

export interface IModalState {
  action: 'create' | 'update' | 'close'
  report?: IReport
  partnerId: string
  timesDeleteClicked?: number
}

export interface IModalController {
  handleError: (err: IApiError) => void
  incTimesDeleteClicked: () => void
  reset: () => void
  set: TSetModalState
  state: IModalState
  updateReports: IUpdateReports
}

const useReports = (handleError: (err: IApiError) => void, propReports: IReport[]) => {
  const [reports, setReports] = React.useState<IReport[]>(propReports)
  const flashContext = React.useContext(FlashContext)

  const initialModalState = { report: undefined, action: 'close' as 'close', partnerId: '', timesDeleteClicked: 0 }
  const [modalState, setModalState] = React.useState<IModalState>(initialModalState)

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
      modalController.reset()
    }
    setReports(newReports)
  }

  const modalController: IModalController = {
    handleError,
    incTimesDeleteClicked: () => setModalState({ ...modalState, timesDeleteClicked: 1 }),
    reset: () => setModalState(initialModalState),
    set: setModalState,
    state: modalState,
    updateReports,
  }

  return { reports, modalController }
}

export default useReports
