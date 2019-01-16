import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import Table from '../../components/table/Table'
import TableModal from '../../components/table/TableModal'
import useTable from '../../components/table/useTable'
import { IWebinar } from '../../sharedTypes'
import api from '../../utils/api'
import Webinar from './Webinar'
import WebinarsForm from './WebinarForm'

const Webinars: React.FC<RouteComponentProps> = () => {
  const { modalController, items } = useTable<IWebinar>('Webinar', api.webinars)

  return (
    <>
      <Table itemTitle="Webinar" modalController={modalController}>
        {items && (
          <div data-testid="Webinars">
            {map(items, item => (
              <Webinar key={item.title} item={item} setModalState={modalController.set} />
            ))}
          </div>
        )}
      </Table>
      <TableModal controller={modalController} itemTitle={'Webinar'}>
        <WebinarsForm modalController={modalController} />
      </TableModal>
    </>
  )
}

export default Webinars
