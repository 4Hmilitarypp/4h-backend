import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import { InputGroup } from '../../components/Elements'
import { IModalController } from '../../components/table/useTable'
import { IPartner } from '../../sharedTypes'
import api from '../../utils/api'

interface IProps {
  modalController: IModalController<IPartner>
}

const Partner2Form: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateItems } = modalController
  const { item: partner, action } = modalController.state

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { shortDescription, longDescription, title, slug } = e.currentTarget.elements
    const updatePartner = {
      _id: partner ? partner._id : undefined,
      annualReports: partner ? partner.annualReports : [],
      featuredImages: partner ? partner.featuredImages : [],
      images: partner ? partner.images : [],
      longDescription: longDescription.value,
      shortDescription: shortDescription.value,
      slug: slug.value,
      title: title.value,
      videoReports: partner ? partner.videoReports : [],
    }
    if (action === 'update') {
      api.partners
        .update(updatePartner._id as string, updatePartner)
        .then(newPartner => {
          updateItems({ item: newPartner, action })
          resetModalState()
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.partners
        .create(updatePartner)
        .then(newPartner => {
          updateItems({ item: newPartner, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }

  return (
    // the id must be what the corresponding modal submit button's formId is
    <Form onSubmit={handleSubmit} id="PartnerForm">
      <InputGroup>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" defaultValue={(partner && partner.title) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="slug">Url To Partner</label>
        <input type="text" id="slug" defaultValue={(partner && partner.slug) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="shortDescription">Short Description</label>
        <textarea id="shortDescription" defaultValue={(partner && partner.shortDescription) || ''} rows={5} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="longDescription">Long Description</label>
        <textarea id="longDescription" defaultValue={(partner && partner.longDescription) || ''} rows={5} />
      </InputGroup>
    </Form>
  )
}

export default Partner2Form

const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
