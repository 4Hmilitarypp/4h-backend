import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, InputGroup } from '../../components/Elements'
import Modal from '../../components/Modal'
import { IApiError, ILiaison } from '../../sharedTypes'
import { IForm } from '../../types'
import api from '../../utils/api'
import { LiaisonsContext } from './Liaisons'

interface IProps {
  liaison: ILiaison
  on: boolean
  setOn: (on: boolean) => void
}

const formatError = (err: IApiError) =>
  (err.response && err.response.data.message) || (err.status && err.status.toString()) || ''

const LiaisonModal: React.FC<IProps> = ({ on, setOn, liaison }) => {
  const [error, setError] = React.useState<string | undefined>(undefined)

  const context = React.useContext(LiaisonsContext)

  React.useEffect(
    () => {
      const timeout = setTimeout(() => setError(undefined), 3500)
      return () => {
        clearTimeout(timeout)
      }
    },
    [error]
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { abbreviation, email, image, name, phoneNumber, region } = e.currentTarget.elements
    api.liaisons
      .update({
        abbreviation: abbreviation.value,
        email: email.value,
        image: image.value,
        liaisonId: liaison.liaisonId,
        name: name.value,
        phoneNumber: phoneNumber.value,
        region: region.value,
      })
      .then(newLiaison => {
        context.updateLiaisons(newLiaison)
        setOn(false)
      })
      .catch((err: IApiError) => setError(formatError(err)))
  }

  return (
    <Modal on={on} setOn={setOn}>
      <Form onSubmit={handleSubmit}>
        {error && <Error>{error}</Error>}
        <InputGroup>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" defaultValue={liaison.name || ''} />
        </InputGroup>
        <InputGroup>
          <label htmlFor="region">Region</label>
          <input type="text" id="region" defaultValue={liaison.region} />
        </InputGroup>
        <InputGroup>
          <label htmlFor="abbreviation">Abbreviation</label>
          <input type="text" id="abbreviation" defaultValue={liaison.abbreviation || ''} />
        </InputGroup>
        <InputGroup>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" defaultValue={liaison.email || ''} />
        </InputGroup>
        <InputGroup>
          <label htmlFor="phoneNumber">PhoneNumber</label>
          <input type="tel" id="phoneNumber" defaultValue={liaison.phoneNumber || ''} />
        </InputGroup>
        <InputGroup>
          <label htmlFor="image">Image</label>
          <input type="url" id="image" defaultValue={liaison.image} />
        </InputGroup>
        <Button type="submit">Update Liaison</Button>
      </Form>
    </Modal>
  )
}

export default LiaisonModal

const Form = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`
const Error = styled.h4`
  color: ${props => props.theme.warning};
  text-align: center;
  margin: -1rem;
`
