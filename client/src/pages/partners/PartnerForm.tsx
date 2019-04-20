import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import { InputGroup } from '../../components/Elements'
import { IApiError, IPartner } from '../../sharedTypes'
import api from '../../utils/api'
import { TUpdatePartners } from './usePartners'

interface IProps {
  action: 'create' | 'update'
  handleError: (err: IApiError) => void
  partner?: IPartner
  updatePartners: TUpdatePartners
}

const PartnerForm: React.FC<IProps> = ({ action, partner, handleError, updatePartners }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const {
      featuredImage1: fi1,
      featuredImage2: fi2,
      shortDescription,
      longDescription,
      title,
      slug,
    } = e.currentTarget.elements

    const featuredImage1 = {
      alt: `${title.value} logo`,
      url: fi1.value,
    }
    const featuredImage2 = {
      alt: `${title.value} logo`,
      url: fi2.value,
    }
    const updatePartner = {
      _id: partner ? partner._id : undefined,
      featuredImage1,
      featuredImage2,
      longDescription: longDescription.value,
      reports: partner ? partner.reports : [],
      shortDescription: shortDescription.value,
      slug: slug.value,
      title: title.value,
    }
    if (action === 'update') {
      api.partners
        .update(updatePartner._id as string, updatePartner)
        .then(newPartner => {
          updatePartners({ partner: newPartner, action })
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.partners
        .create(updatePartner)
        .then(newPartner => {
          updatePartners({ partner: newPartner, action })
        })
        .catch(handleError)
    }
  }

  return (
    // the id on the form must be what the corresponding submit button's formId is
    <Form onSubmit={handleSubmit} id="PartnerForm">
      <CustomInputGroup>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" defaultValue={(partner && partner.title) || ''} autoFocus={true} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="slug">Partner Slug</label>
        <input type="text" id="slug" defaultValue={(partner && partner.slug) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="featuredImage1">Partner Featured Image</label>
        <input type="text" id="featuredImage1" defaultValue={(partner && partner.featuredImage1.url) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="featuredImage2">Optional Second Featured Image</label>
        <input
          type="text"
          id="featuredImage2"
          defaultValue={(partner && partner.featuredImage2 && partner.featuredImage2.url) || ''}
        />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="shortDescription">Short Description</label>
        {/* Had to do the following because the shortDescription was not showing up for some reason */}
        {partner ? (
          <>
            <textarea id="shortDescription" defaultValue={partner.shortDescription || ''} cols={100} rows={5} />
          </>
        ) : (
          <textarea id="shortDescription" cols={100} rows={5} />
        )}
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="longDescription">Long Description</label>
        {/* Had to do the following because the longDescription was not showing up for some reason */}
        {partner ? (
          <>
            <textarea id="longDescription" defaultValue={partner.longDescription} cols={100} rows={5} />
          </>
        ) : (
          <textarea id="longDescription" cols={100} rows={5} />
        )}
      </CustomInputGroup>
    </Form>
  )
}

export default PartnerForm

const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
const CustomInputGroup = styled(InputGroup)`
  input,
  textarea {
    background: ${props => props.theme.white};
  }
`
