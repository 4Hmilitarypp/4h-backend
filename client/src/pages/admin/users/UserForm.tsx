import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../../clientTypes'
import { InputGroup, LeftSubHeading } from '../../../components/Elements'
import { IModalController } from '../../../components/table/useTable'
import { IUser } from '../../../sharedTypes'
import api from '../../../utils/api'

interface IProps {
  modalController: IModalController<IUser>
}

const UserForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateItems: updateUsers } = modalController
  const { item: user, action } = modalController.state

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { admin, affiliation, applicationUser, confirmPassword, email, name, password, university } = e.currentTarget
      .elements as any

    const permissions = []

    if (admin.checked) permissions.push('admin')
    if (applicationUser.checked) permissions.push('application-user')

    const updateUser = {
      _id: user ? user._id : undefined,
      affiliation: affiliation.value,
      confirmPassword: action === 'create' ? confirmPassword.value : undefined,
      email: email.value,
      name: name.value,
      password: action === 'create' ? password.value : undefined,
      permissions,
      university: university.value,
    }

    if (action === 'update') {
      api.users
        .update(updateUser._id as string, updateUser)
        .then(newUser => {
          updateUsers({ item: newUser, action })
          resetModalState()
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.users
        .create(updateUser)
        .then(newUser => {
          updateUsers({ item: newUser, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }
  return (
    <Form onSubmit={handleSubmit} id="UserForm">
      <InputGroup>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" defaultValue={(user && user.name) || ''} autoFocus={true} required={true} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" defaultValue={(user && user.email) || ''} required={true} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="affiliation">Affiliation</label>
        <input type="text" id="affiliation" defaultValue={(user && user.affiliation) || ''} required={true} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="university">University</label>
        <input type="text" id="university" defaultValue={(user && user.university) || ''} required={true} />
      </InputGroup>
      {!user && (
        <InputGroup>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required={true} />
        </InputGroup>
      )}
      {!user && (
        <InputGroup>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" required={true} />
        </InputGroup>
      )}
      <CustomSubHeading>Permissions</CustomSubHeading>
      <PermissionGroup>
        <label htmlFor="admin">Admin</label>
        <CheckBox type="checkbox" id="admin" defaultChecked={user && user.permissions.includes('admin')} />
        <label htmlFor="applicationUser">Application User</label>
        <CheckBox
          type="checkbox"
          id="applicationUser"
          defaultChecked={user && user.permissions.includes('application-user')}
        />
      </PermissionGroup>
    </Form>
  )
}

export default UserForm
const Form = styled.form`
  padding: 1.2rem 2rem 0;
  display: flex;
  flex-direction: column;
`
const CheckBox = styled.input`
  margin-left: 1.6rem;
`
const CustomSubHeading = styled(LeftSubHeading)`
  font-size: 2rem;
  padding-bottom: 0.8rem;
`
const PermissionGroup = styled.div`
  flex-grow: 1;
  margin: 0 0 1.2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
