import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../contexts/FlashContext'
import useErrorHandler from '../../hooks/useErrorHandler'
import { IApiError } from '../../sharedTypes'

export type TUpdateItems<T> = ({
  _id,
  action,
  item,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete'
  item?: T
}) => void

export type TSetModalState<T> = ({ action, item }: IModalState<T>) => void

export interface IModalState<T> {
  action: 'create' | 'update' | 'close'
  item?: T
  timesDeleteClicked?: number
}

export interface IModalController<T> {
  api: any
  handleError: (err: IApiError) => void
  incTimesDeleteClicked: () => void
  reset: () => void
  set: TSetModalState<T>
  state: IModalState<T>
  updateItems: TUpdateItems<T>
}

interface IItem {
  _id?: string
  title?: string
  region?: string
}

function useTable<T extends IItem>(itemTitle: string, api: any) {
  const [items, setItems] = React.useState<T[]>([])
  const flashContext = React.useContext(FlashContext)

  const initialModalState = { webinar: undefined, action: 'close' as 'close', timesDeleteClicked: 0 }
  const [modalState, setModalState] = React.useState<IModalState<T>>(initialModalState)
  const handleError = useErrorHandler()
  React.useEffect(() => {
    api
      .get()
      .then((res: T[]) => setItems(res))
      .catch(handleError)
  }, []) // eslint-disable-line

  const updateItems: TUpdateItems<T> = ({ _id, action, item }) => {
    if (items) {
      let newItems: T[] = []
      if (action === 'update' && item) {
        newItems = map(items, r => (r._id === item._id ? item : r))
        flashContext.set({ message: `${itemTitle} Updated Successfully` })
      } else if (action === 'create' && item) {
        newItems = [item, ...items]
        flashContext.set({ message: `${itemTitle} Created Successfully` })
      } else if (action === 'delete') {
        newItems = filter(items, r => r._id !== _id)
        flashContext.set({ message: `${itemTitle} Deleted Successfully` })
        modalController.reset()
      }
      setItems(newItems)
    }
  }

  const modalController: IModalController<T> = {
    api,
    handleError,
    incTimesDeleteClicked: () => setModalState({ ...modalState, timesDeleteClicked: 1 }),
    reset: () => setModalState(initialModalState),
    set: setModalState,
    state: modalState,
    updateItems,
  }
  return {
    items,
    modalController,
  }
}

export default useTable
