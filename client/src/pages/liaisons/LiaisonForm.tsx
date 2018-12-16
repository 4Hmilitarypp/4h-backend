import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../components/Elements'
import { ILiaison } from '../../sharedTypes'

interface IProps {
  onSubmit: (e: any) => void
  liaison?: ILiaison
}

const LiaisonForm: React.FC<IProps> = ({ onSubmit, liaison, children }) => (
  <Form onSubmit={onSubmit}>
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
    {children}
  </Form>
)

export default LiaisonForm
const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
