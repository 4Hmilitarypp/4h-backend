import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../../components/Elements'
import Table from '../../../components/table/Table'
import TableModal from '../../../components/table/TableModal'
import useTable from '../../../components/table/useTable'
import { IUser } from '../../../sharedTypes'
import api from '../../../utils/api'
import User from './User'
import UserForm from './UserForm'

const Users: React.FC<RouteComponentProps> = () => {
  const { modalController, items: users } = useTable<IUser>('User', api.users)

  const [filterText, setFilterText] = React.useState<string>('')
  const isFound = (...args: string[]) => args.some(s => s.toLowerCase().includes(filterText))
  const filterUsers = () => users.filter(user => !filterText || isFound(user.name, user.email, user.affiliation))

  return (
    <>
      <Table itemTitle="User" itemTitlePlural="Users" modalController={modalController}>
        {users && (
          <div data-testid="Users">
            <CustomInputGroup color="white">
              <label>Filter Users</label>
              <input value={filterText} onChange={e => setFilterText(e.currentTarget.value.toLowerCase())} />
            </CustomInputGroup>
            {map(filterUsers(), user => (
              <User key={user.email} user={user} setModalState={modalController.set} />
            ))}
          </div>
        )}
      </Table>
      <TableModal controller={modalController} itemTitle="User">
        <UserForm modalController={modalController} />
      </TableModal>
    </>
  )
}

export default Users
const CustomInputGroup = styled(InputGroup)`
  margin: 0 2.4rem 2rem;
`
