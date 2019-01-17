import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import Table from '../../components/table/Table'
import TableModal from '../../components/table/TableModal'
import useTable from '../../components/table/useTable'
import { IPartner } from '../../sharedTypes'
import api from '../../utils/api'
import Partner from './Partner'
import PartnersForm from './PartnerForm'

const Partners: React.FC<RouteComponentProps> = () => {
  const { modalController, items: partners } = useTable<IPartner>('Partner', api.partners)

  return (
    <>
      <Table itemTitle="Partner" itemTitlePlural="Partners" modalController={modalController}>
        {partners && (
          <div data-testid="Partners">
            {map(partners, partner => (
              <Partner key={partner.title} partner={partner} setModalState={modalController.set} />
            ))}
          </div>
        )}
      </Table>
      <TableModal controller={modalController} itemTitle="Partner">
        <PartnersForm modalController={modalController} />
      </TableModal>
    </>
  )
}

export default Partners
