import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import { InputGroup } from '../../components/Elements'
import { IModalController } from '../../components/table/useTable'
import { ILiaison } from '../../sharedTypes'
import api from '../../utils/api'

interface IProps {
  modalController: IModalController<ILiaison>
}

const LiaisonForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateItems: updateLiaisons } = modalController
  const { item: liaison, action } = modalController.state

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { abbreviation, email, image, name, phoneNumber, region } = e.currentTarget.elements
    const updateLiaison = {
      _id: liaison ? liaison._id : undefined,
      abbreviation: abbreviation.value,
      email: email.value,
      image: image.value,
      name: name.value,
      phoneNumber: phoneNumber.value,
      region: region.value,
    }
    if (action === 'update') {
      api.liaisons
        .update(updateLiaison._id as string, updateLiaison)
        .then(newLiaison => {
          updateLiaisons({ item: newLiaison, action })
          resetModalState()
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.liaisons
        .create(updateLiaison)
        .then(newLiaison => {
          updateLiaisons({ item: newLiaison, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }
  return (
    <Form onSubmit={handleSubmit} id="LiaisonForm">
      <InputGroup>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" defaultValue={(liaison && liaison.name) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="region">Region</label>
        <input type="text" id="region" defaultValue={liaison && liaison.region} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="abbreviation">Abbreviation</label>
        <input type="text" id="abbreviation" defaultValue={(liaison && liaison.abbreviation) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" defaultValue={(liaison && liaison.email) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="phoneNumber">PhoneNumber</label>
        <input type="tel" id="phoneNumber" defaultValue={(liaison && liaison.phoneNumber) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="image">Image</label>
        <input type="url" id="image" defaultValue={liaison && liaison.image} />
      </InputGroup>
    </Form>
  )
}

export default LiaisonForm
const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
