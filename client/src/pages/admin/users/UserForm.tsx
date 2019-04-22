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
    const { admin, confirmPassword, email, name, password } = e.currentTarget.elements as any
    if (action === 'update') {
      const updateUser = {
        _id: user ? user._id : undefined,
        email: email.value,
        name: name.value,
        permissions: admin.checked ? ['admin'] : [],
      }
      api.users
        .update(updateUser._id as string, updateUser)
        .then(newUser => {
          updateUsers({ item: newUser, action })
          resetModalState()
        })
        .catch(handleError)
    } else if (action === 'create') {
      const createUser = {
        _id: user ? user._id : undefined,
        confirmPassword: confirmPassword.value,
        email: email.value,
        name: name.value,
        password: password.value,
        permissions: admin.checked ? ['admin'] : [],
      }
      api.users
        .create(createUser)
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
        <input type="text" id="name" defaultValue={(user && user.name) || ''} autoFocus={true} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" defaultValue={(user && user.email) || ''} />
      </InputGroup>
      {!user && (
        <InputGroup>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </InputGroup>
      )}
      {!user && (
        <InputGroup>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" />
        </InputGroup>
      )}
      <CustomSubHeading>Permissions</CustomSubHeading>
      <PermissionGroup>
        <label htmlFor="admin">Admin</label>
        <CheckBox type="checkbox" id="admin" defaultChecked={user && user.permissions.includes('admin')} />
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
