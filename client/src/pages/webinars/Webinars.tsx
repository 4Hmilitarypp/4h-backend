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
  const { modalController, items: webinars } = useTable<IWebinar>('Webinar', api.webinars)

  return (
    <>
      <Table itemTitle="Webinar" itemTitlePlural="Webinars" modalController={modalController}>
        {webinars && (
          <div data-testid="Webinars">
            {map(webinars, webinar => (
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
