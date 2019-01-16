import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import Table from '../../components/table/Table'
import TableModal from '../../components/table/TableModal'
import useTable from '../../components/table/useTable'
import { ILiaison } from '../../sharedTypes'
import api from '../../utils/api'
import Liaison from './Liaison'
import LiaisonForm from './LiaisonForm'

const Liaisons2: React.FC<RouteComponentProps> = () => {
  const { modalController, items } = useTable<ILiaison>('Liaison', api.liaisons)

  return (
    <>
      <Table itemTitle="Liaison" modalController={modalController}>
        {items && (
          <div data-testid="Liaisons">
            {map(items, item => (
              <Liaison key={item.region} item={item} setModalState={modalController.set} />
            ))}
          </div>
        )}
      </Table>
      <TableModal controller={modalController} itemTitle={'Liaison'}>
        <LiaisonForm modalController={modalController} />
      </TableModal>
    </>
  )
}

export default Liaisons2
