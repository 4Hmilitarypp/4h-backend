import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import Table from '../../components/table/Table'
import TableModal from '../../components/table/TableModal'
import useTable from '../../components/table/useTable'
import { IResearch } from '../../sharedTypes'
import api from '../../utils/api'
import Research from './Research'
import ResearchesForm from './ResearchForm'

const Researches: React.FC<RouteComponentProps> = () => {
  const { modalController, items: researches } = useTable<IResearch>('Research', api.research)

  return (
    <>
      <Table itemTitle="Research" itemTitlePlural="Research" modalController={modalController}>
        {researches && (
          <div data-testid="Researches">
            {map(researches, research => (
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
