import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../components/Elements'
import Table from '../../components/table/Table'
import TableModal from '../../components/table/TableModal'
import useTable from '../../components/table/useTable'
import usePermission from '../../hooks/useRole'
import { ILiaison } from '../../sharedTypes'
import api from '../../utils/api'
import Liaison from './Liaison'
import LiaisonForm from './LiaisonForm'

const Liaisons: React.FC<RouteComponentProps> = () => {
  const { modalController, items: liaisons } = useTable<ILiaison>('Liaison', api.liaisons)
  usePermission('admin')

  const [filterText, setFilterText] = React.useState<string>('')
  const isFound = (...args: string[]) => args.some(s => s.toLowerCase().includes(filterText))

  const filterLiaisons = () => liaisons.filter(liaison => !filterText || isFound(liaison.name || '', liaison.region))

  return (
    <>
      <Table itemTitle="Liaison" itemTitlePlural="Liaisons" modalController={modalController}>
        <CustomInputGroup color="white">
          <label>Filter Liaisons</label>
          <input value={filterText} onChange={e => setFilterText(e.currentTarget.value.toLowerCase())} />
        </CustomInputGroup>
        {liaisons && (
          <div data-testid="Liaisons">
            {map(filterLiaisons(), liaison => (
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
const CustomInputGroup = styled(InputGroup)`
  margin: 0 2.4rem 2rem;
`
