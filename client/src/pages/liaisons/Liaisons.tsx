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

const Liaisons: React.FC<RouteComponentProps> = () => {
  const { modalController, items: liaisons } = useTable<ILiaison>('Liaison', api.liaisons)

  return (
    <>
      <Table itemTitle="Liaison" itemTitlePlural="Liaisons" modalController={modalController}>
        {liaisons && (
          <div data-testid="Liaisons">
            {map(liaisons, liaison => (
              <Liaison key={liaison.region + liaison.email} liaison={liaison} setModalState={modalController.set} />
            ))}
          </div>
        )}
      </Table>
      <TableModal controller={modalController} itemTitle="Liaison">
        <LiaisonForm modalController={modalController} />
      </TableModal>
    </>
  )
}

export default Liaisons
