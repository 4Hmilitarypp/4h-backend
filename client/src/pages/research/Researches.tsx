import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components'
import { InputGroup } from '../../components/Elements'
import Table from '../../components/table/Table'
import TableModal from '../../components/table/TableModal'
import useTable from '../../components/table/useTable'
import usePermission from '../../hooks/useRole'
import { IResearch } from '../../sharedTypes'
import api from '../../utils/api'
import Research from './Research'
import ResearchesForm from './ResearchForm'

const Researches: React.FC<RouteComponentProps> = () => {
  const { modalController, items: researches } = useTable<IResearch>('Research', api.research)
  usePermission('admin')

  const [filterText, setFilterText] = React.useState<string>('')
  const isFound = (...args: string[]) => args.some(s => s.toLowerCase().includes(filterText))
  const filteredResearches = () => researches.filter(research => !filterText || isFound(research.title))

  return (
    <>
      <Table itemTitle="Research" itemTitlePlural="Research" modalController={modalController}>
        <CustomInputGroup color="white">
          <label>Research Filter</label>
          <input value={filterText} onChange={e => setFilterText(e.currentTarget.value.toLowerCase())} />
        </CustomInputGroup>
        {researches && (
          <div data-testid="Researches">
            {map(filteredResearches(), research => (
              <Research key={research.title} research={research} setModalState={modalController.set} />
            ))}
          </div>
        )}
      </Table>
      <TableModal controller={modalController} itemTitle="Research">
        <ResearchesForm modalController={modalController} />
      </TableModal>
    </>
  )
}

export default Researches

const CustomInputGroup = styled(InputGroup)`
  margin: 0 2.4rem 2rem;
`
