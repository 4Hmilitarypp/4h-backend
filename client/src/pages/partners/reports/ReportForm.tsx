import * as React from 'react'
import { IForm } from '../../../clientTypes'
import { InputGroup, ModalForm } from '../../../components/Elements'
import { IImage } from '../../../sharedTypes'
import api from '../../../utils/api'
import { IModalController } from './useReports'

interface IProps {
  modalController: IModalController
}

const ReportForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateReports } = modalController
  const { report, action } = modalController.state

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { imageAlt, imageUrl, title, reportUrl } = e.currentTarget.elements

    const image: IImage = {
      alt: imageAlt.value,
      url: imageUrl.value,
    }

    const updateReport = {
      _id: report ? report._id : undefined,
      image,
      title: title.value,
      url: reportUrl.value,
    }
    if (action === 'create') {
      api.reports
        .create(modalController.state.partnerId, updateReport)
        .then(newReport => {
          updateReports({ report: newReport, action })
          resetModalState()
        })
        .catch(handleError)
    } else {
      api.reports
        .update(modalController.state.partnerId, updateReport._id as string, updateReport)
        .then(newReport => {
          updateReports({ report: newReport, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }

  return (
    <ModalForm onSubmit={handleSubmit} id="reportForm">
      <InputGroup>
        <label htmlFor="title">Report Title</label>
        <input type="text" id="title" defaultValue={(report && report.title) || ''} autoFocus={true} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="imageUrl">Cover Image Url</label>
        <input type="text" id="imageUrl" defaultValue={(report && report.image && report.image.url) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="imageAlt">Cover Image Description</label>
        <input type="text" id="imageAlt" defaultValue={(report && report.image && report.image.alt) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor={`reportUrl`}>Report Resource</label>
        <input type="url" id={`reportUrl`} defaultValue={report ? report.url : ''} />
      </InputGroup>
    </ModalForm>
  )
}

export default ReportForm
