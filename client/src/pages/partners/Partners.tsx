import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import usePermission from '../../hooks/usePermission'
import { IPartnerSection } from '../../sharedTypes'
import Partner from './Partner'
import PartnerTable from './PartnerTable'
import usePartners, { TUpdatePartners } from './usePartners'

export interface IPartnerContext {
  partners: IPartnerSection[]
  updatePartners: TUpdatePartners
}
export const PartnerContext = React.createContext<IPartnerContext>(undefined as any)

const Partners: React.FC<RouteComponentProps> = () => {
  const { handleError, partners, updatePartners } = usePartners()
  usePermission('admin')

  return (
    <PartnerContext.Provider value={{ partners, updatePartners }}>
      {partners.length > 0 && <div data-testid="Partners" />}
      <Router>
        <PartnerTable path="/" />
        <Partner handleError={handleError} path="/:id" />
      </Router>
    </PartnerContext.Provider>
  )
}
export default Partners
