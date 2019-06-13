import * as React from 'react'
import { IForm } from '../../../clientTypes'
import { InputGroup, ModalForm } from '../../../components/Elements'
import api from '../../../utils/api'
import { IModalController } from './useCampDates'

interface IProps {
  modalController: IModalController
}

const formatDate = (date: string) => {
  const localDate = new Date(date.split('-').join(' '))
  localDate.setUTCHours(17)
  return localDate.toISOString()
}

const CampDateForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateCampDates } = modalController
  const { campDate, action } = modalController.state

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { beginDate, endDate } = e.currentTarget.elements
    const updateCampDate = {
      _id: campDate ? campDate._id : undefined,
      beginDate: formatDate(beginDate.value),
      endDate: formatDate(endDate.value),
    }
    if (action === 'create') {
      api.campDates
        .create(modalController.state.campId, updateCampDate)
        .then(newCampDate => {
          updateCampDates({ campDate: newCampDate, action })
          resetModalState()
        })
        .catch(handleError)
    } else {
      api.campDates
        .update(modalController.state.campId, updateCampDate._id as string, updateCampDate)
        .then(newCampDate => {
          updateCampDates({ campDate: newCampDate, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }

  return (
    <ModalForm onSubmit={handleSubmit} id="campDateForm">
      <InputGroup>
        <label htmlFor="beginDate">Camp Begin Date</label>
        <input
          type="date"
          id="beginDate"
          defaultValue={(campDate && campDate.beginDate.substr(0, 10)) || ''}
          autoFocus={true}
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="endDate">Camp End Date</label>
        <input type="date" id="endDate" defaultValue={(campDate && campDate.endDate.substr(0, 10)) || ''} />
      </InputGroup>
    </ModalForm>
  )
}

export default CampDateForm
