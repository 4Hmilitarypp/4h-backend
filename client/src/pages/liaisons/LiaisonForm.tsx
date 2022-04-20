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
    const { abbreviation, email, image, name, phoneNumber, stateOrRegion, countryCode } = e.currentTarget.elements
    const updateLiaison = {
      _id: liaison ? liaison._id : undefined,
      abbreviation: abbreviation.value,
      email: email.value,
      image: image.value,
      name: name.value,
      phoneNumber: phoneNumber.value,
      stateOrRegion: stateOrRegion.value,
      countryCode: countryCode.value,
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
        <input
          type="text"
          id="name"
          placeholder="Judith Conde Pacheco"
          defaultValue={(liaison && liaison.name) || ''}
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="countryCode">Country Code</label>
        <input type="text" id="countryCode" placeholder="PR" defaultValue={liaison && liaison.countryCode} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="stateOrRegion">State Or Region</label>
        <input
          type="text"
          id="stateOrRegion"
          placeholder="Puerto Rico"
          defaultValue={liaison && liaison.stateOrRegion}
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="abbreviation">Abbreviation</label>
        <input type="text" id="abbreviation" placeholder="PR" defaultValue={(liaison && liaison.abbreviation) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Puerto Rico" defaultValue={(liaison && liaison.email) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          placeholder="913-123-4567"
          defaultValue={(liaison && liaison.phoneNumber) || ''}
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="image">Image</label>
        <input
          type="url"
          id="image"
          placeholder="https://res.cloudinary.com/four-hmpp/image/upload/f_auto,q_auto/v1543361622/logos/lgus/alaska.jpg"
          defaultValue={liaison && liaison.image}
        />
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
