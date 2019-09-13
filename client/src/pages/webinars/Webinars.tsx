import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components'
import { InputGroup } from '../../components/Elements'
import Table from '../../components/table/Table'
import TableModal from '../../components/table/TableModal'
import useTable from '../../components/table/useTable'
import usePermission from '../../hooks/usePermission'
import { IWebinar } from '../../sharedTypes'
import api from '../../utils/api'
import Webinar from './Webinar'
import WebinarsForm from './WebinarForm'

const Webinars: React.FC<RouteComponentProps> = () => {
  const { modalController, items: webinars } = useTable<IWebinar>('Webinar', api.webinars)
  usePermission('admin')

  const [filterText, setFilterText] = React.useState<string>('')
  const isFound = (...args: string[]) => args.some(s => s.toLowerCase().includes(filterText))
  const filteredWebinars = () => webinars.filter(webinar => !filterText || isFound(webinar.title))

  return (
    <>
      <Table itemTitle="Webinar" itemTitlePlural="Webinars" modalController={modalController}>
        <CustomInputGroup color="white">
          <label>Filter Webinars</label>
          <input value={filterText} onChange={e => setFilterText(e.currentTarget.value.toLowerCase())} />
        </CustomInputGroup>
        {webinars && (
          <div data-testid="Webinars">
            {map(filteredWebinars(), webinar => (
              <Webinar key={webinar.title} webinar={webinar} setModalState={modalController.set} />
            ))}
          </div>
        )}
      </Table>
      <TableModal controller={modalController} itemTitle="Webinar">
        <WebinarsForm modalController={modalController} />
      </TableModal>
    </>
  )
}

export default Webinars

const CustomInputGroup = styled(InputGroup)`
  margin: 0 2.4rem 2rem;
`
