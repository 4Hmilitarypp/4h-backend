import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import Table from '../../../components/table/Table'
import TableModal from '../../../components/table/TableModal'
import useTable from '../../../components/table/useTable'
import { IUser } from '../../../sharedTypes'
import api from '../../../utils/api'
import User from './User'
import UserForm from './UserForm'

const Users: React.FC<RouteComponentProps> = () => {
  const { modalController, items: users } = useTable<IUser>('User', api.users)

  return (
    <>
      <Table itemTitle="User" itemTitlePlural="Users" modalController={modalController}>
        {users && (
          <div data-testid="Users">
            {map(users, user => (
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
